import BorrowRequest, { IBorrowRequest } from "../models/BorrowRequest";
import Item from "../models/Item";

export const createBorrowRequest = async (
  requestData: Partial<IBorrowRequest>
): Promise<IBorrowRequest> => {
  // Check if item exists and is available
  const item = await Item.findById(requestData.itemId);
  if (!item) {
    throw new Error("Item not found");
  }
  if (!item.available) {
    throw new Error("This item is not available for borrowing");
  }

  // Check for existing active request from same borrower for same item
  const existing = await BorrowRequest.findOne({
    itemId: requestData.itemId,
    borrowerId: requestData.borrowerId,
    status: { $in: ["Pending", "Approved", "Active"] },
  });

  if (existing) {
    throw new Error("You already have an active request for this item");
  }

  // Cannot request own item
  if (item.ownerId === requestData.borrowerId) {
    throw new Error("You cannot request to borrow your own item");
  }

  return BorrowRequest.create(requestData);
};

export const getBorrowRequests = async (): Promise<IBorrowRequest[]> => {
  return BorrowRequest.find().sort({ createdAt: -1 });
};

export const getBorrowRequestById = async (id: string): Promise<IBorrowRequest | null> => {
  return BorrowRequest.findById(id);
};

export const getBorrowRequestsByBorrowerId = async (
  borrowerId: string
): Promise<IBorrowRequest[]> => {
  return BorrowRequest.find({ borrowerId }).sort({ createdAt: -1 });
};

export const getBorrowRequestsByOwnerId = async (ownerId: string): Promise<IBorrowRequest[]> => {
  return BorrowRequest.find({ ownerId }).sort({ createdAt: -1 });
};

export const updateBorrowRequest = async (
  id: string,
  updateData: Partial<IBorrowRequest>
): Promise<IBorrowRequest | null> => {
  return BorrowRequest.findByIdAndUpdate(id, updateData, { new: true });
};
