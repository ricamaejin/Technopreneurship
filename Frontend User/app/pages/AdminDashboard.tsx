import { useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { 
  Package, 
  Users, 
  AlertTriangle, 
  TrendingUp,
  Search,
  Eye,
  Trash2,
  Ban,
  CheckCircle,
  XCircle,
  Shield
} from "lucide-react";
import { mockItems, mockRequests } from "../data/mockData";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!user.isAdmin) {
    navigate('/');
    return null;
  }

  const totalListings = mockItems.length;
  const activeListings = mockItems.filter(item => item.available).length;
  const totalRequests = mockRequests.length;
  const pendingRequests = mockRequests.filter(req => req.status === 'Pending').length;
  const flaggedItems = 2; // Mock data
  const totalUsers = 156; // Mock data

  const handleDeleteItem = (itemId: string) => {
    toast.success("Item deleted successfully");
  };

  const handleSuspendUser = (userId: string) => {
    toast.warning("User account suspended");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Manage listings, users, and platform activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Package className="h-4 w-4" />
                Total Listings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalListings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {activeListings} active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalUsers}</div>
              <p className="text-xs text-green-600 mt-1">
                +12 this week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {pendingRequests} pending
              </p>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Flagged Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-800">{flaggedItems}</div>
              <p className="text-xs text-orange-600 mt-1">
                Need review
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="listings">All Listings</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="flagged">Flagged</TabsTrigger>
          </TabsList>

          {/* Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Listings</CardTitle>
                <CardDescription>Manage and moderate all platform listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search listings..."
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  {mockItems.map(item => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span>{item.ownerName}</span>
                          <span>•</span>
                          <span>Deposit: ₱{item.deposit}</span>
                          <span>•</span>
                          <Badge variant={item.available ? "secondary" : "destructive"} className="text-xs">
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Borrow Requests</CardTitle>
                <CardDescription>Monitor all platform transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRequests.map(request => (
                    <div key={request.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <img 
                        src={request.itemImage} 
                        alt={request.itemTitle}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{request.itemTitle}</h4>
                        <div className="flex items-center gap-2 mb-2">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={request.borrowerAvatar} />
                            <AvatarFallback className="text-xs">
                              {request.borrowerName.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">
                            {request.borrowerName} → {request.ownerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={
                            request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                            request.status === 'Approved' ? 'bg-green-100 text-green-800 border-green-200' :
                            request.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' :
                            'bg-gray-100 text-gray-800 border-gray-200'
                          }>
                            {request.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(request.startDate).toLocaleDateString()} - {new Date(request.endDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Platform Users</CardTitle>
                <CardDescription>Manage user accounts and permissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Sample users */}
                  {mockItems.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={item.ownerAvatar} />
                        <AvatarFallback>
                          {item.ownerName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-semibold">{item.ownerName}</h4>
                        <p className="text-sm text-muted-foreground">
                          {item.ownerRating} ⭐ • Member since Jan 2024
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleSuspendUser(item.ownerId)}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flagged Tab */}
          <TabsContent value="flagged" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Items</CardTitle>
                <CardDescription>Items reported by users or flagged by the system</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <img 
                      src={mockItems[0].images[0]} 
                      alt={mockItems[0].title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{mockItems[0].title}</h4>
                          <p className="text-sm text-muted-foreground">{mockItems[0].ownerName}</p>
                        </div>
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Reported
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">
                        <span className="font-medium">Reason:</span> Item not as described
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Resolve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Remove Item
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <img 
                      src={mockItems[1].images[0]} 
                      alt={mockItems[1].title}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold">{mockItems[1].title}</h4>
                          <p className="text-sm text-muted-foreground">{mockItems[1].ownerName}</p>
                        </div>
                        <Badge variant="destructive" className="gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Overdue
                        </Badge>
                      </div>
                      <p className="text-sm mb-3">
                        <span className="font-medium">Issue:</span> Item not returned on time
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Mark Resolved
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Borrower
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}