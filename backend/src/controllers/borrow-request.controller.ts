import type { Request, Response } from "express";
import {
  createBorrowRequest,
  getBorrowRequests,
  getBorrowRequestById,
  getBorrowRequestsByBorrowerId,
  getBorrowRequestsByOwnerId,
  updateBorrowRequest,
} from "../services/borrow-request.service";

export const createBorrowRequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const requestData = req.body;
    const request = await createBorrowRequest(requestData);
    res.status(201).json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to create borrow request", error });
  }
};

export const getBorrowRequestsHandler = async (_req: Request, res: Response): Promise<void> => {
  try {
    const requests = await getBorrowRequests();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrow requests", error });
  }
};

export const getBorrowRequestByIdHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const request = await getBorrowRequestById(id);
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
    const requests = await getBorrowRequestsByBorrowerId(borrowerId);
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
    const requests = await getBorrowRequestsByOwnerId(ownerId);
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch borrow requests", error });
  }
};

export const updateBorrowRequestHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const request = await updateBorrowRequest(id, updateData);
    if (!request) {
      res.status(404).json({ message: "Borrow request not found" });
      return;
    }
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: "Failed to update borrow request", error });
  }
};
