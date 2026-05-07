import { mockItems, mockRequests, currentUser } from "../../../Frontend User/app/data/mockData";

const makeEmail = (name: string, id: string) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.|\.$/g, "");
  return `${base || "user"}.${id}@example.com`;
};

const daysSince = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
};

const usersById = new Map<string, {
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
}>();

const ensureUser = (id: string, name: string, avatar: string | undefined, rating: number, joinDate: string) => {
  if (!id) return;
  if (!usersById.has(id)) {
    usersById.set(id, {
      id,
      name,
      email: makeEmail(name, id),
      phone: "+63 900 000 0000",
      avatar,
      joinDate,
      listings: 0,
      borrowRequests: 0,
      status: "active",
      verified: rating >= 4.8,
      trustScore: rating || 4.5,
    });
  }
};

mockItems.forEach((item) => {
  ensureUser(item.ownerId, item.ownerName, item.ownerAvatar, item.ownerRating, item.createdAt);
  const owner = usersById.get(item.ownerId);
  if (owner) {
    owner.listings += 1;
    owner.joinDate = owner.joinDate || item.createdAt;
  }
});

mockRequests.forEach((request) => {
  ensureUser(request.borrowerId, request.borrowerName, request.borrowerAvatar, 4.6, request.createdAt);
  ensureUser(request.ownerId, request.ownerName, undefined, 4.7, request.createdAt);
  const borrower = usersById.get(request.borrowerId);
  if (borrower) {
    borrower.borrowRequests += 1;
  }
});

ensureUser(currentUser.id, currentUser.name, currentUser.avatar, currentUser.rating, currentUser.joinDate);
const current = usersById.get(currentUser.id);
if (current) {
  current.email = currentUser.email;
  current.trustScore = currentUser.rating;
  current.verified = currentUser.rating >= 4.8;
}

export const mockUsers = Array.from(usersById.values());

export const mockListings = mockItems.map((item) => {
  const borrowCount = mockRequests.filter((request) => request.itemId === item.id).length;
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    owner: item.ownerName,
    ownerId: item.ownerId,
    deposit: item.deposit,
    dailyRate: item.rentalFeePerDay,
    image: item.images[0] || "",
    status: item.available ? "active" : "pending",
    featured: item.isFeatured || false,
    createdDate: item.createdAt,
    borrowCount,
    rating: item.ownerRating,
  };
});

export const mockBorrowRequests = mockRequests.map((request) => {
  const item = mockItems.find((i) => i.id === request.itemId);
  return {
    id: `BR-${request.id}`,
    itemTitle: request.itemTitle,
    itemId: request.itemId,
    itemImage: request.itemImage,
    borrower: request.borrowerName,
    borrowerId: request.borrowerId,
    lender: request.ownerName,
    lenderId: request.ownerId,
    borrowerAvatar: request.borrowerAvatar,
    startDate: request.startDate,
    endDate: request.endDate,
    status: request.status,
    deposit: item?.deposit || 0,
    createdAt: request.createdAt,
    message: request.message,
  };
});

export const mockOverdueItems = mockRequests
  .filter((request) => request.status === "Overdue")
  .map((request, index) => {
    const item = mockItems.find((i) => i.id === request.itemId);
    const daysOverdue = daysSince(request.endDate);
    const flagColor = daysOverdue > 5 ? "red" : daysOverdue > 2 ? "orange" : "yellow";
    return {
      id: `OD-${index + 1}`,
      itemName: request.itemTitle,
      borrower: request.borrowerName,
      borrowerId: request.borrowerId,
      avatar: request.borrowerAvatar,
      dueDate: request.endDate,
      daysOverdue,
      flagColor,
      deposit: item?.deposit || 0,
    };
  });

export const mockDisputes = mockRequests.slice(0, 2).map((request, index) => {
  const severity = index === 0 ? "High" : "Medium";
  return {
    id: `D-${request.id}`,
    title: index === 0 ? "Item Returned Damaged" : "Late Return Without Communication",
    itemTitle: request.itemTitle,
    reporter: request.ownerName,
    reporterId: request.ownerId,
    defendant: request.borrowerName,
    defendantId: request.borrowerId,
    reportDate: request.createdAt,
    status: index === 0 ? "Open" : "In Progress",
    severity,
    description: index === 0
      ? "Reported damage on return. Awaiting verification."
      : "Borrower has not responded to return reminders.",
    adminNotes: "",
  };
});

const categoryCounts = mockItems.reduce<Record<string, number>>((acc, item) => {
  acc[item.category] = (acc[item.category] || 0) + 1;
  return acc;
}, {});

export const categoryStats = Object.entries(categoryCounts).map(([name, value]) => ({
  name,
  value,
}));

const totalRequests = mockRequests.length;
const returnedRequests = mockRequests.filter((request) => request.status === "Returned").length;
export const borrowVolumeData = Array.from({ length: 6 }, (_, idx) => {
  const factor = (idx + 1) / 6;
  return {
    week: `Week ${idx + 1}`,
    volume: Math.round(totalRequests * factor),
    returned: Math.round(returnedRequests * factor),
  };
});

const lenderStats = mockItems.reduce<Record<string, { name: string; listings: number; trustScore: number }>>(
  (acc, item) => {
    if (!acc[item.ownerId]) {
      acc[item.ownerId] = { name: item.ownerName, listings: 0, trustScore: item.ownerRating };
    }
    acc[item.ownerId].listings += 1;
    return acc;
  },
  {}
);

export const topLenders = Object.values(lenderStats)
  .sort((a, b) => b.listings - a.listings)
  .slice(0, 4)
  .map((lender, idx) => ({
    ...lender,
    earnings: `₱${(lender.listings * 4200 + idx * 1500).toLocaleString()}`,
  }));

export const adminStats = {
  totalUsers: mockUsers.length,
  activeListings: mockListings.filter((listing) => listing.status === "active").length,
  pendingRequests: mockBorrowRequests.filter((request) => request.status === "Pending").length,
  overdueItems: mockOverdueItems.length,
  featuredListings: mockListings.filter((listing) => listing.featured).length,
  disputes: mockDisputes.length,
  newUsersThisWeek: Math.min(12, mockUsers.length),
  totalBorrowVolume: mockBorrowRequests.length,
  returnedThisWeek: mockBorrowRequests.filter((request) => request.status === "Returned").length,
};
