import { useState, useMemo } from "react";
import { Search, CheckCircle, XCircle, Eye, MoreVertical } from "lucide-react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { mockBorrowRequests } from "../data/mockAdminData";
import { toast } from "sonner";

const statuses = ["Pending", "Approved", "Active", "Overdue", "Returned"];

export default function RequestsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [requests, setRequests] = useState(mockBorrowRequests);
  const [selectedRequest, setSelectedRequest] = useState<(typeof mockBorrowRequests)[number] | null>(null);

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesSearch =
        request.itemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
        request.lender.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || request.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [requests, searchQuery, statusFilter]);

  const handleApprove = (requestId: string) => {
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "Approved" } : r)));
    toast.success("Request approved!");
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.filter((r) => r.id !== requestId));
    toast.error("Request rejected");
  };

  const handleMarkActive = (requestId: string) => {
    setRequests(requests.map((r) => (r.id === requestId ? { ...r, status: "Active" } : r)));
    toast.success("Request marked as active");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Approved":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Overdue":
        return "bg-red-100 text-red-800 border-red-200";
      case "Returned":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AdminHeader />
      <AdminSidebar />

      <main className="pt-20 pb-8 pl-[var(--admin-sidebar-width)]">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-orange-400 to-orange-500 bg-clip-text text-transparent">
              Borrow Requests
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and process all borrowing requests
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            {statuses.map((status, idx) => {
              const count = requests.filter((r) => r.status === status).length;
              const colors = [
                "from-yellow-500 to-yellow-600",
                "from-blue-500 to-blue-600",
                "from-green-500 to-green-600",
                "from-red-500 to-red-600",
                "from-gray-500 to-gray-600",
              ];
              return (
                <div key={status} className={`p-4 rounded-lg bg-gradient-to-r ${colors[idx]} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                  <p className="text-sm opacity-90">{status}</p>
                  <p className="text-3xl font-bold mt-1">{count}</p>
                </div>
              );
            })}
          </div>

          {/* Filter Section */}
          <Card className="border-2 mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Search & Filter by Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by item, borrower, or lender..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "bg-primary hover:bg-primary/90" : ""}
                >
                  All
                </Button>
                {statuses.map((status) => (
                  <Button
                    key={status}
                    variant={statusFilter === status ? "default" : "outline"}
                    onClick={() => setStatusFilter(status)}
                    className={statusFilter === status ? "bg-primary hover:bg-primary/90" : ""}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Requests Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className="border-2 overflow-hidden hover:shadow-xl transition-all hover:scale-[1.01] group"
              >
                <div className="relative h-48 overflow-hidden bg-muted">
                  <img
                    src={request.itemImage}
                    alt={request.itemTitle}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <Badge className={`absolute top-2 left-2 ${getStatusColor(request.status)}`}>
                    {request.status}
                  </Badge>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-lg line-clamp-2">{request.itemTitle}</CardTitle>
                  <CardDescription>Request ID: {request.id}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={request.borrowerAvatar} />
                      <AvatarFallback>{request.borrower.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                    </Avatar>
                    <div className="text-sm">
                      <p className="font-semibold">{request.borrower}</p>
                      <p className="text-xs text-muted-foreground">→ {request.lender}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Dates</p>
                      <p className="text-sm font-semibold">
                        {new Date(request.startDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        to {new Date(request.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="rounded-lg border p-3">
                      <p className="text-xs text-muted-foreground">Deposit</p>
                      <p className="text-sm font-semibold">₱{request.deposit.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {request.status === "Pending" && (
                      <>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={() => handleApprove(request.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="w-full text-destructive"
                          onClick={() => handleReject(request.id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                      </>
                    )}
                    {request.status === "Approved" && (
                      <Button
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        onClick={() => handleMarkActive(request.id)}
                      >
                        Mark as Active
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Dialog open={Boolean(selectedRequest)} onOpenChange={(open) => !open && setSelectedRequest(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Borrow Request Details</DialogTitle>
                <DialogDescription>Full request context for admin review</DialogDescription>
              </DialogHeader>
              {selectedRequest && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="w-full h-48 bg-muted rounded-lg overflow-hidden">
                      <img
                        src={selectedRequest.itemImage}
                        alt={selectedRequest.itemTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Item</p>
                      <p className="text-lg font-semibold">{selectedRequest.itemTitle}</p>
                      <p className="text-xs text-muted-foreground">Request ID: {selectedRequest.id}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Borrower</p>
                      <p className="font-semibold">{selectedRequest.borrower}</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Lender</p>
                      <p className="font-semibold">{selectedRequest.lender}</p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Dates</p>
                      <p className="font-semibold">
                        {new Date(selectedRequest.startDate).toLocaleDateString()} to {new Date(selectedRequest.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Status</p>
                      <Badge className={getStatusColor(selectedRequest.status)}>{selectedRequest.status}</Badge>
                    </div>
                    <div className="p-4 rounded-lg border">
                      <p className="text-xs text-muted-foreground">Deposit</p>
                      <p className="text-lg font-semibold">₱{selectedRequest.deposit.toLocaleString()}</p>
                    </div>
                    {selectedRequest.message && (
                      <div className="p-4 rounded-lg border">
                        <p className="text-xs text-muted-foreground">Borrower Message</p>
                        <p className="text-sm">{selectedRequest.message}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Empty State */}
          {filteredRequests.length === 0 && (
            <Card className="border-2 border-dashed text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">No requests found matching your filters</p>
                <Button variant="outline" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
