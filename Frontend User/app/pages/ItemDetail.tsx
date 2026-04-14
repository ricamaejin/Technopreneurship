import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../components/ui/dialog";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";
import { 
  MapPin, 
  Star, 
  Calendar as CalendarIcon, 
  Shield, 
  AlertCircle, 
  ArrowLeft,
  Send,
  CheckCircle
} from "lucide-react";
import { mockItems, currentUser } from "../data/mockData";
import { format } from "date-fns";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const item = mockItems.find(i => i.id === id);
  
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [message, setMessage] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleBorrowClick = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    setIsDialogOpen(true);
  };

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-semibold mb-4">Item not found</h1>
          <Link to="/">
            <Button>Back to Browse</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmitRequest = () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    
    toast.success("Borrow request sent successfully!", {
      description: `${item.ownerName} will review your request soon.`,
    });
    
    setIsDialogOpen(false);
    setStartDate(undefined);
    setEndDate(undefined);
    setMessage("");
  };

  const conditionColors = {
    'New': 'bg-green-100 text-green-800 border-green-200',
    'Excellent': 'bg-blue-100 text-blue-800 border-blue-200',
    'Good': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Fair': 'bg-orange-100 text-orange-800 border-orange-200',
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-muted mb-4">
              <img 
                src={item.images[0]} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{item.title}</h1>
                  <Badge variant="outline" className={conditionColors[item.condition]}>
                    {item.condition} Condition
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Rental Fee</div>
                  <div className="text-2xl font-bold text-primary">₱{item.rentalFeePerDay}/day</div>
                  <div className="text-xs text-muted-foreground mt-1">Deposit: ₱{item.deposit}</div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4" />
                <span>{item.location}</span>
              </div>

              <Badge variant={item.available ? "secondary" : "destructive"} className="mb-4">
                {item.available ? "Available" : "Currently Unavailable"}
              </Badge>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </div>

            {/* Category */}
            <div>
              <h3 className="font-semibold mb-2">Category</h3>
              <Badge variant="outline">{item.category}</Badge>
            </div>

            {/* Owner Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Owner Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={item.ownerAvatar} alt={item.ownerName} />
                    <AvatarFallback>{item.ownerName.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-semibold">{item.ownerName}</div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{item.ownerRating} rating</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Info */}
            <Card className="bg-accent/50 border-accent">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Shield className="h-5 w-5 text-accent-foreground flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1 text-accent-foreground">Pricing & Deposit</h4>
                    <p className="text-sm text-accent-foreground/80">
                      Rental fee is ₱{item.rentalFeePerDay} per day. A deposit of ₱{item.deposit} is required. Payment is handled offline or via GCash. 
                      The deposit will be returned upon safe return of the item.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Borrow Request Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <Button 
                size="lg" 
                className="w-full" 
                disabled={!item.available}
                onClick={handleBorrowClick}
              >
                <Send className="h-4 w-4 mr-2" />
                Request to Borrow
              </Button>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Request to Borrow</DialogTitle>
                  <DialogDescription>
                    Fill out the details below to send a borrow request to {item.ownerName}.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          disabled={(date) => !startDate || date < startDate}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea
                      id="message"
                      placeholder="Let the owner know why you need this item..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex gap-2 text-sm">
                      <AlertCircle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-muted-foreground">
                        The owner will review your request and respond within 24 hours. 
                        Deposit payment will be arranged after approval.
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitRequest}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Send Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}
