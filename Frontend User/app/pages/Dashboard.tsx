import { useEffect, useState, type ChangeEvent } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { 
  Package, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Calendar,
  Edit,
  Trash2,
  Eye,
  AlertCircle
} from "lucide-react";
import { mockItems, mockRequests, BorrowRequest, Item, categories } from "../data/mockData";
import { Link, useNavigate } from "react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState<Item[]>(() => {
    const storedItems = localStorage.getItem('lendly_items');
    if (storedItems) {
      try {
        return JSON.parse(storedItems);
      } catch {
        return mockItems;
      }
    }
    return mockItems;
  });
  const [requests, setRequests] = useState<BorrowRequest[]>(() => {
    const storedRequests = localStorage.getItem('lendly_requests');
    if (storedRequests) {
      try {
        return JSON.parse(storedRequests);
      } catch {
        return mockRequests;
      }
    }
    return mockRequests;
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    images: [] as string[],
    rentalFeePerDay: "",
    deposit: "",
    location: "",
    available: true,
  });

  useEffect(() => {
    localStorage.setItem('lendly_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('lendly_requests', JSON.stringify(requests));
  }, [requests]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const myItems = items.filter(item => item.ownerId === user.id);
  const myRequests = requests.filter(req => req.borrowerId === user.id);
  const incomingRequests = requests.filter(req => req.ownerId === user.id);

  const handleEditItem = (item: Item) => {
    setEditingItemId(item.id);
    setEditForm({
      title: item.title,
      description: item.description,
      category: item.category,
      condition: item.condition,
      images: item.images,
      rentalFeePerDay: item.rentalFeePerDay.toString(),
      deposit: item.deposit.toString(),
      location: item.location,
      available: item.available,
    });
    setIsEditDialogOpen(true);
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const fileReaders = Array.from(files).map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error("Failed to read file"));
          reader.readAsDataURL(file);
        }),
    );

    try {
      const uploadedImages = await Promise.all(fileReaders);
      setEditForm((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages].slice(0, 5),
      }));
      if (uploadedImages.length + editForm.images.length > 5) {
        toast.info("Maximum of 5 images allowed.");
      } else {
        toast.success("Images updated. Save changes to apply.");
      }
    } catch {
      toast.error("Failed to process one or more images.");
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setEditForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSaveItemChanges = () => {
    if (!editingItemId) return;

    if (
      !editForm.title ||
      !editForm.description ||
      !editForm.category ||
      !editForm.condition ||
      !editForm.rentalFeePerDay ||
      !editForm.deposit ||
      !editForm.location
    ) {
      toast.error("Please fill in all required item fields.");
      return;
    }

    if (editForm.images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }

    setItems(prev =>
      prev.map(item =>
        item.id === editingItemId
          ? {
              ...item,
              title: editForm.title,
              description: editForm.description,
              category: editForm.category,
              condition: editForm.condition as Item['condition'],
              images: editForm.images,
              rentalFeePerDay: Number(editForm.rentalFeePerDay),
              deposit: Number(editForm.deposit),
              location: editForm.location,
              available: editForm.available,
            }
          : item,
      ),
    );

    setIsEditDialogOpen(false);
    setEditingItemId(null);
    toast.success("Item details updated successfully.");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'Active': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Returned': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'Overdue': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="h-4 w-4" />;
      case 'Approved': return <CheckCircle className="h-4 w-4" />;
      case 'Rejected': return <XCircle className="h-4 w-4" />;
      case 'Active': return <Package className="h-4 w-4" />;
      case 'Returned': return <CheckCircle className="h-4 w-4" />;
      case 'Overdue': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Approved' } : req));
    toast.success("Request approved!", {
      description: "The borrower has been notified.",
    });
  };

  const handleRejectRequest = (requestId: string) => {
    setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Rejected' } : req));
    toast.info("Request rejected", {
      description: "The borrower has been notified.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="flex items-start gap-6 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="text-2xl">
                {user.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{user.name}</h1>
              <p className="text-muted-foreground mb-3">{user.email}</p>
              <div className="flex items-center gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Member since:</span>
                  <span className="ml-2 font-medium">{format(new Date(user.joinDate), 'MMMM yyyy')}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Rating:</span>
                  <span className="ml-2 font-medium">{user.rating} ⭐</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Reviews:</span>
                  <span className="ml-2 font-medium">{user.reviewCount}</span>
                </div>
              </div>
            </div>
            <Link to="/add-listing">
              <Button>List New Item</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Listings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myItems.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {myItems.filter(i => i.available).length} available
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">My Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{myRequests.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {myRequests.filter(r => r.status === 'Pending').length} pending
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Incoming Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{incomingRequests.length}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {incomingRequests.filter(r => r.status === 'Pending').length} need review
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-items" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="my-items">My Items</TabsTrigger>
            <TabsTrigger value="my-requests">My Requests</TabsTrigger>
            <TabsTrigger value="incoming">Incoming</TabsTrigger>
          </TabsList>

          {/* My Items Tab */}
          <TabsContent value="my-items" className="space-y-4">
            {myItems.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No items listed yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Start earning by listing your tools and equipment
                  </p>
                  <Link to="/add-listing">
                    <Button>List Your First Item</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myItems.map(item => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold mb-1">{item.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-1">{item.description}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-sm">
                          <Badge variant={item.available ? "secondary" : "destructive"}>
                            {item.available ? "Available" : "Unavailable"}
                          </Badge>
                          <span className="text-muted-foreground">Deposit: ₱{item.deposit}</span>
                          <span className="text-muted-foreground">•</span>
                          <span className="text-muted-foreground">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* My Requests Tab */}
          <TabsContent value="my-requests" className="space-y-4">
            {myRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No borrow requests yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Browse items and send your first borrow request
                  </p>
                  <Link to="/">
                    <Button>Browse Items</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              myRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={request.itemImage} 
                        alt={request.itemTitle}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold mb-1">{request.itemTitle}</h3>
                            <p className="text-sm text-muted-foreground">
                              Owner: {request.ownerName}
                            </p>
                          </div>
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                          </div>
                        </div>
                        {request.message && (
                          <p className="text-sm text-muted-foreground italic">"{request.message}"</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-2">
                          Request status: {request.status}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Incoming Requests Tab */}
          <TabsContent value="incoming" className="space-y-4">
            {incomingRequests.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-medium mb-2">No incoming requests</h3>
                  <p className="text-sm text-muted-foreground">
                    Requests from borrowers will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              incomingRequests.map(request => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <img 
                        src={request.itemImage} 
                        alt={request.itemTitle}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold mb-1">{request.itemTitle}</h3>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={request.borrowerAvatar} />
                                <AvatarFallback className="text-xs">
                                  {request.borrowerName.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-sm text-muted-foreground">
                                {request.borrowerName}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className={getStatusColor(request.status)}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(request.status)}
                              {request.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(request.startDate), 'MMM d')} - {format(new Date(request.endDate), 'MMM d, yyyy')}
                          </div>
                        </div>
                        {request.message && (
                          <p className="text-sm mb-3 p-3 bg-muted rounded-lg">"{request.message}"</p>
                        )}
                        {request.status === 'Pending' && (
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveRequest(request.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectRequest(request.id)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[760px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Item Details</DialogTitle>
            <DialogDescription>
              Update your listing details, images, pricing, and availability.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-2 md:grid-cols-[250px_1fr]">
            <div className="space-y-3">
              <div className="rounded-lg border overflow-hidden bg-muted/40">
                {editForm.images[0] ? (
                  <img
                    src={editForm.images[0]}
                    alt="Cover preview"
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="h-40 flex items-center justify-center text-sm text-muted-foreground">
                    No image selected
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Cover preview (first image)</p>

              <div className="space-y-2">
                <Label htmlFor="edit-images">Upload Images *</Label>
                <input
                  id="edit-images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="sr-only"
                />
                <label
                  htmlFor="edit-images"
                  className="group flex cursor-pointer items-center justify-between rounded-md border border-dashed p-3 transition-colors hover:border-primary/70 hover:bg-muted/40"
                >
                  <div>
                    <p className="text-sm font-medium">Choose files</p>
                    <p className="text-xs text-muted-foreground">Tap to browse images from your device</p>
                  </div>
                  <span className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground">
                    Upload
                  </span>
                </label>
                <p className="text-xs text-muted-foreground">
                  Up to 5 images. First image is used as cover. Selected: {editForm.images.length}
                </p>
              </div>

              {editForm.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {editForm.images.map((image, index) => (
                    <div key={`${image}-${index}`} className="relative">
                      <img
                        src={image}
                        alt={`Item preview ${index + 1}`}
                        className="h-16 w-full rounded-md object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Item Title *</Label>
                <Input
                  id="edit-title"
                  value={editForm.title}
                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Description *</Label>
                <Textarea
                  id="edit-description"
                  rows={4}
                  value={editForm.description}
                  onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={editForm.category}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Condition *</Label>
                  <Select
                    value={editForm.condition}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, condition: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="Excellent">Excellent</SelectItem>
                      <SelectItem value="Good">Good</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-rate">Rental Fee Per Day (₱) *</Label>
                  <Input
                    id="edit-rate"
                    type="number"
                    min={1}
                    value={editForm.rentalFeePerDay}
                    onChange={(e) => setEditForm(prev => ({ ...prev, rentalFeePerDay: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-deposit">Deposit (₱) *</Label>
                  <Input
                    id="edit-deposit"
                    type="number"
                    min={0}
                    value={editForm.deposit}
                    onChange={(e) => setEditForm(prev => ({ ...prev, deposit: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-location">Location *</Label>
                <Input
                  id="edit-location"
                  value={editForm.location}
                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium">Available for Borrowing</p>
                  <p className="text-xs text-muted-foreground">Toggle if this item is currently available.</p>
                </div>
                <Switch
                  checked={editForm.available}
                  onCheckedChange={(checked) => setEditForm(prev => ({ ...prev, available: checked }))}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveItemChanges}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}