const API_BASE_URL = "http://localhost:5000/api/admin";

// Admin User Type
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  joinDate: string;
  listings: number;
  borrowRequests: number;
  status: "active" | "suspended";
  verified: boolean;
  trustScore: number;
}

// Admin Listing Type
export interface AdminListing {
  id: string;
  title: string;
  category: string;
  owner: string;
  ownerId: string;
  deposit: number;
  dailyRate: number;
  image: string;
  status: "active" | "pending";
  featured: boolean;
  createdDate: string;
  borrowCount: number;
  rating: number;
}

// Admin Borrow Request Type
export interface AdminBorrowRequest {
  id: string;
  itemTitle: string;
  itemId: string;
  itemImage: string;
  borrower: string;
  borrowerId: string;
  lender: string;
  lenderId: string;
  borrowerAvatar: string;
  startDate: string;
  endDate: string;
  status: string;
  deposit: number;
  createdAt: string;
  message: string;
}

// Overdue Item Type
export interface OverdueItem {
  id: string;
  itemName: string;
  borrower: string;
  borrowerId: string;
  avatar: string;
  dueDate: string;
  daysOverdue: number;
  flagColor: "red" | "orange" | "yellow";
  deposit: number;
}

// Dispute Type
export interface Dispute {
  id: string;
  title: string;
  itemTitle: string;
  reporter: string;
  reporterId: string;
  defendant: string;
  defendantId: string;
  reportDate: string;
  status: "Open" | "In Progress" | "Resolved" | "Escalated";
  severity: "High" | "Medium" | "Low";
  description: string;
  adminNotes: string;
}

// Category Stats Type
export interface CategoryStat {
  name: string;
  value: number;
}

// Borrow Volume Type
export interface BorrowVolume {
  week: string;
  volume: number;
  returned: number;
}

// Top Lender Type
export interface TopLender {
  name: string;
  listings: number;
  trustScore: number;
  earnings: string;
}

// Admin Stats Type
export interface AdminStats {
  totalUsers: number;
  activeListings: number;
  pendingRequests: number;
  overdueItems: number;
  featuredListings: number;
  disputes: number;
  newUsersThisWeek: number;
  totalBorrowVolume: number;
  returnedThisWeek: number;
}

// Fetch Functions
export const fetchAdminUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch(`${API_BASE_URL}/users`);
  if (!response.ok) throw new Error("Failed to fetch admin users");
  return response.json();
};

export const fetchAdminListings = async (): Promise<AdminListing[]> => {
  const response = await fetch(`${API_BASE_URL}/listings`);
  if (!response.ok) throw new Error("Failed to fetch admin listings");
  return response.json();
};

export const fetchAdminBorrowRequests = async (): Promise<AdminBorrowRequest[]> => {
  const response = await fetch(`${API_BASE_URL}/borrow-requests`);
  if (!response.ok) throw new Error("Failed to fetch admin borrow requests");
  return response.json();
};

export const fetchOverdueItems = async (): Promise<OverdueItem[]> => {
  const response = await fetch(`${API_BASE_URL}/overdue-items`);
  if (!response.ok) throw new Error("Failed to fetch overdue items");
  return response.json();
};

export const fetchDisputes = async (): Promise<Dispute[]> => {
  const response = await fetch(`${API_BASE_URL}/disputes`);
  if (!response.ok) throw new Error("Failed to fetch disputes");
  return response.json();
};

export const fetchCategoryStats = async (): Promise<CategoryStat[]> => {
  const response = await fetch(`${API_BASE_URL}/category-stats`);
  if (!response.ok) throw new Error("Failed to fetch category stats");
  return response.json();
};

export const fetchBorrowVolume = async (): Promise<BorrowVolume[]> => {
  const response = await fetch(`${API_BASE_URL}/borrow-volume`);
  if (!response.ok) throw new Error("Failed to fetch borrow volume");
  return response.json();
};

export const fetchTopLenders = async (): Promise<TopLender[]> => {
  const response = await fetch(`${API_BASE_URL}/top-lenders`);
  if (!response.ok) throw new Error("Failed to fetch top lenders");
  return response.json();
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await fetch(`${API_BASE_URL}/stats`);
  if (!response.ok) throw new Error("Failed to fetch admin stats");
  return response.json();
};
