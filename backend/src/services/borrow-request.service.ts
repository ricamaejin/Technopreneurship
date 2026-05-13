import BorrowRequest, { IBorrowRequest } from "../models/BorrowRequest";

export const createBorrowRequest = async (
  requestData: Partial<IBorrowRequest>
): Promise<IBorrowRequest> => {
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
