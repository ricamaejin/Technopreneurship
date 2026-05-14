import type { Request, Response } from "express";
import Item from "../models/Item";
import {
  createBorrowRequest,
  getBorrowRequests,
  getBorrowRequestById,
  getBorrowRequestsByBorrowerId,
  getBorrowRequestsByOwnerId,
  updateBorrowRequest,
} from "../services/borrow-request.service";
import { createNotification as createNotif } from "../services/notification.service";

export const createBorrowRequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestData = req.body;
    const request = await createBorrowRequest(requestData);

    // Create notification for the item owner
    await createNotif({
      userId: request.ownerId,
      type: "borrow_request",
      title: "New Borrow Request",
      message: `${request.borrowerName} wants to borrow your ${request.itemTitle}.`,
      referenceId: request._id?.toString(),
      referenceType: "borrowRequest",
    });

    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create borrow request", error });
  }
};

// Helper to check if user is authorized to access the resource
const isAuthorized = (req: Request, userId: string, ownerId?: string): boolean => {
  const user = (req as any).user;
  if (!user) return false;
  if (user.isAdmin) return true;
  if (user.id === userId || user._id === userId) return true;
  // Additional check: if viewing as owner, could use ownerId param?
  // We'll rely on caller to pass correct userId param and check both borrowerId and ownerId logic in specific handlers.
  return false;
};

export const getBorrowRequestsHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = (req as any).user;
    if (!user?.isAdmin) {
      res.status(403).json({ message: "Admin access required" });
      return;
    }
    const requests = await getBorrowRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrow requests", error });
  }
};

export const getBorrowRequestByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requestId = Array.isArray(id) ? id[0] : id;

    if (!requestId) {
      res.status(400).json({ message: "Invalid borrow request id" });
      return;
    }

    const request = await getBorrowRequestById(requestId);
    if (!request) {
      res.status(404).json({ message: "Borrow request not found" });
      return;
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrow request", error });
  }
};

export const getBorrowRequestsByBorrowerIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { borrowerId } = req.params;
    const resolvedBorrowerId = Array.isArray(borrowerId) ? borrowerId[0] : borrowerId;

    if (!resolvedBorrowerId) {
      res.status(400).json({ message: "Invalid borrower id" });
      return;
    }

    // Authorization: user can only fetch their own requests
    const user = (req as any).user;
    if (!user?.id || (user.id !== resolvedBorrowerId && user._id !== resolvedBorrowerId && !user.isAdmin)) {
      res.status(403).json({ message: "Not authorized to view these requests" });
      return;
    }

    const requests = await getBorrowRequestsByBorrowerId(resolvedBorrowerId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrow requests", error });
  }
};

export const getBorrowRequestsByOwnerIdHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { ownerId } = req.params;
    const resolvedOwnerId = Array.isArray(ownerId) ? ownerId[0] : ownerId;

    if (!resolvedOwnerId) {
      res.status(400).json({ message: "Invalid owner id" });
      return;
    }

    // Authorization: user can only fetch requests for their own items (unless admin)
    const user = (req as any).user;
    if (!user?.id || (user.id !== resolvedOwnerId && user._id !== resolvedOwnerId && !user.isAdmin)) {
      res.status(403).json({ message: "Not authorized to view these requests" });
      return;
    }

    const requests = await getBorrowRequestsByOwnerId(resolvedOwnerId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrow requests", error });
  }
};

export const updateBorrowRequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const requestId = Array.isArray(id) ? id[0] : id;

    if (!requestId) {
      res.status(400).json({ message: "Invalid borrow request id" });
      return;
    }

    // Get the existing request to check ownership and get old status
    const existingRequest = await getBorrowRequestById(requestId);
    if (!existingRequest) {
      res.status(404).json({ message: "Borrow request not found" });
      return;
    }

    const user = (req as any).user;
    if (!user?.id) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    // Only the owner of the item can update the request (approve/reject) or admin
    if (existingRequest.ownerId !== user.id && existingRequest.ownerId !== user._id && !user.isAdmin) {
      res.status(403).json({ message: "You can only update requests for your own items" });
      return;
    }

    const updateData = req.body;
    const request = await updateBorrowRequest(requestId, updateData);

    if (!request) {
      res.status(404).json({ message: "Borrow request not found after update" });
      return;
    }

    // If status changed to Approved or Active, mark item as unavailable
    if (updateData.status === "Approved" || updateData.status === "Active") {
      await Item.findByIdAndUpdate(request.itemId, { available: false });

      // Notify borrower that request was approved
      await createNotif({
        userId: request.borrowerId,
        type: "request_approved",
        title: "Request Approved!",
        message: `${request.ownerName} approved your borrow request for "${request.itemTitle}".`,
        referenceId: request._id?.toString(),
        referenceType: "borrowRequest",
      });
    }
    // If status changed to Returned or Rejected, mark item as available again
    else if (updateData.status === "Returned" || updateData.status === "Rejected") {
      await Item.findByIdAndUpdate(request.itemId, { available: true });

      // Notify borrower about rejection or completion
      const notifType = updateData.status === "Rejected" ? "request_rejected" : "item_returned";
      const notifTitle = updateData.status === "Rejected" ? "Request Rejected" : "Item Returned";
      const notifMessage = updateData.status === "Rejected"
        ? `${request.ownerName} rejected your borrow request for "${request.itemTitle}".`
        : `${request.ownerName} marked "${request.itemTitle}" as returned. Thank you!`;

      await createNotif({
        userId: request.borrowerId,
        type: notifType,
        title: notifTitle,
        message: notifMessage,
        referenceId: request._id?.toString(),
        referenceType: "borrowRequest",
      });
    }

    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to update borrow request", error });
  }
};
