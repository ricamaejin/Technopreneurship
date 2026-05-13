const API_BASE_URL = "http://localhost:5000/api";

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  isAdmin: boolean;
  joinDate: string;
  rating: number;
  reviewCount: number;
}

export interface Item {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  condition: "New" | "Excellent" | "Good" | "Fair";
  rentalFeePerDay: number;
  deposit: number;
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  ownerRating: number;
  location: string;
  available: boolean;
  isFeatured?: boolean;
  createdAt: string;
}

export interface BorrowRequest {
  _id?: string;
  id?: string;
  itemId: string;
  itemTitle: string;
  itemImage: string;
  borrowerId: string;
  borrowerName: string;
  borrowerAvatar?: string;
  ownerId: string;
  ownerName: string;
  startDate: string;
  endDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Active" | "Returned" | "Overdue";
  message?: string;
  createdAt: string;
  returnedAt?: string;
}

// User API
export const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch users");
  return response.json();
};

export const createUser = async (userData: Partial<User>): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error("Failed to create user");
  return response.json();
};

export const fetchUserById = async (id: string): Promise<User> => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`);
  if (!response.ok) throw new Error("Failed to fetch user");
  return response.json();
};

// Item API
export const fetchItems = async (): Promise<Item[]> => {
  const response = await fetch(`${API_BASE_URL}/items`);
  if (!response.ok) throw new Error("Failed to fetch items");
  return response.json();
};

export const fetchFeaturedItems = async (): Promise<Item[]> => {
  const response = await fetch(`${API_BASE_URL}/items/featured`);
  if (!response.ok) throw new Error("Failed to fetch featured items");
  return response.json();
};

export const fetchItemById = async (id: string): Promise<Item> => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`);
  if (!response.ok) throw new Error("Failed to fetch item");
  return response.json();
};

export const createItem = async (itemData: Partial<Item>): Promise<Item> => {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(itemData),
  });
  if (!response.ok) throw new Error("Failed to create item");
  return response.json();
};

export const updateItem = async (id: string, updateData: Partial<Item>): Promise<Item> => {
  const response = await fetch(`${API_BASE_URL}/items/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Failed to update item");
  return response.json();
};

// Borrow Request API
export const fetchBorrowRequests = async (): Promise<BorrowRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests`);
  if (!response.ok) throw new Error("Failed to fetch borrow requests");
  return response.json();
};

export const fetchBorrowRequestById = async (id: string): Promise<BorrowRequest> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests/${id}`);
  if (!response.ok) throw new Error("Failed to fetch borrow request");
  return response.json();
};

export const fetchBorrowRequestsByBorrowerId = async (
  borrowerId: string
): Promise<BorrowRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests/borrower/${borrowerId}`);
  if (!response.ok) throw new Error("Failed to fetch borrow requests");
  return response.json();
};

export const fetchBorrowRequestsByOwnerId = async (
  ownerId: string
): Promise<BorrowRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests/owner/${ownerId}`);
  if (!response.ok) throw new Error("Failed to fetch borrow requests");
  return response.json();
};

export const createBorrowRequest = async (
  requestData: Partial<BorrowRequest>
): Promise<BorrowRequest> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestData),
  });
  if (!response.ok) throw new Error("Failed to create borrow request");
  return response.json();
};

export const updateBorrowRequest = async (
  id: string,
  updateData: Partial<BorrowRequest>
): Promise<BorrowRequest> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updateData),
  });
  if (!response.ok) throw new Error("Failed to update borrow request");
  return response.json();
};
