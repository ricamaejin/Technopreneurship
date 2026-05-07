import { useState } from "react";
import { Flag, MessageSquare, CheckCircle, AlertTriangle, MoreVertical } from "lucide-react";
import { AdminHeader } from "../components/AdminHeader";
import { AdminSidebar } from "../components/AdminSidebar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { mockDisputes } from "../data/mockAdminData";
import { toast } from "sonner";

export default function DisputesPage() {
  const [disputes, setDisputes] = useState(mockDisputes);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDispute, setSelectedDispute] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState("");

  const filteredDisputes = disputes.filter((dispute) => {
    if (statusFilter === "all") return true;
    return dispute.status === statusFilter;
  });

  const handleAddNote = (disputeId: string, notes: string) => {
    setDisputes(disputes.map((d) => (d.id === disputeId ? { ...d, adminNotes: notes } : d)));
    setAdminNotes("");
    setSelectedDispute(null);
    toast.success("Notes added to dispute");
  };

  const handleResolveDispute = (disputeId: string) => {
    setDisputes(disputes.map((d) => (d.id === disputeId ? { ...d, status: "Resolved" } : d)));
    toast.success("Dispute resolved");
  };

  const handleEscalate = (disputeId: string) => {
    setDisputes(disputes.map((d) => (d.id === disputeId ? { ...d, status: "Escalated" } : d)));
    toast.warning("Dispute escalated for further review");
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High":
        return "bg-red-100 text-red-800 border-red-200";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-red-100 text-red-800 border-red-200";
      case "In Progress":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "Escalated":
        return "bg-orange-100 text-orange-800 border-orange-200";
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
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 via-orange-400 to-red-500 bg-clip-text text-transparent">
              Disputes Queue
            </h1>
            <p className="text-muted-foreground mt-2">
              Review and resolve user disputes
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Disputes", value: disputes.length, icon: "⚖️", color: "from-red-500 to-red-600" },
              { label: "Open", value: disputes.filter((d) => d.status === "Open").length, icon: "🔴", color: "from-orange-500 to-orange-600" },
              { label: "In Progress", value: disputes.filter((d) => d.status === "In Progress").length, icon: "⏳", color: "from-blue-500 to-blue-600" },
              { label: "Resolved", value: disputes.filter((d) => d.status === "Resolved").length, icon: "✅", color: "from-green-500 to-green-600" },
            ].map((stat, idx) => (
              <div key={idx} className={`p-4 rounded-lg bg-gradient-to-r ${stat.color} text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-90">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <span className="text-4xl">{stat.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <Card className="border-2 mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-2 flex-wrap">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  onClick={() => setStatusFilter("all")}
                  className={statusFilter === "all" ? "bg-primary hover:bg-primary/90" : ""}
                >
                  All
                </Button>
                {["Open", "In Progress", "Resolved"].map((status) => (
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

          {/* Disputes List */}
          <div className="space-y-4">
            {filteredDisputes.map((dispute) => (
              <Card
                key={dispute.id}
                className="border-2 hover:shadow-lg transition-all group overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Flag Icon */}
                    <div className="md:col-span-1 flex items-start pt-2">
                      <Flag className="h-6 w-6 text-red-500 flex-shrink-0" />
                    </div>

                    {/* Dispute Details */}
                    <div className="md:col-span-7 space-y-3">
                      <div>
                        <h3 className="font-bold text-lg">{dispute.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Item: <span className="font-semibold">{dispute.itemTitle}</span>
                        </p>
                      </div>

                      {/* Parties */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-semibold">Reporter:</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dispute.reporter}`} />
                            <AvatarFallback>{dispute.reporter.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{dispute.reporter}</span>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <span className="text-sm font-semibold">Defendant:</span>
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${dispute.defendant}`} />
                            <AvatarFallback>{dispute.defendant.split(" ").map((n) => n[0]).join("")}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">{dispute.defendant}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="p-3 bg-muted/50 rounded-lg border">
                        <p className="text-sm"><strong>Issue:</strong> {dispute.description}</p>
                      </div>

                      {/* Admin Notes */}
                      {dispute.adminNotes && (
                        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                          <p className="text-xs font-semibold text-green-900 mb-1">Admin Resolution Notes:</p>
                          <p className="text-sm text-green-800">{dispute.adminNotes}</p>
                        </div>
                      )}
                    </div>

                    {/* Status & Actions */}
                    <div className="md:col-span-4 space-y-3">
                      <div className="space-y-2">
                        <div>
                          <Badge className={`text-xs ${getStatusColor(dispute.status)}`}>
                            {dispute.status}
                          </Badge>
                        </div>
                        <div>
                          <Badge className={`text-xs ${getSeverityColor(dispute.severity)}`}>
                            {dispute.severity} Severity
                          </Badge>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p>Reported: {new Date(dispute.reportDate).toLocaleDateString()}</p>
                      </div>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setSelectedDispute(dispute.id);
                              setAdminNotes(dispute.adminNotes);
                            }}
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Add Notes
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Add Resolution Notes</DialogTitle>
                            <DialogDescription>
                              Document your resolution findings and actions for {dispute.title}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Enter your resolution notes..."
                              value={adminNotes}
                              onChange={(e) => setAdminNotes(e.target.value)}
                              className="min-h-32"
                            />
                            <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setSelectedDispute(null)}>
                                Cancel
                              </Button>
                              <Button
                                className="bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleAddNote(dispute.id, adminNotes)}
                              >
                                Save Notes
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full">
                            <MoreVertical className="h-4 w-4 mr-2" />
                            Actions
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {dispute.status !== "Resolved" && (
                            <DropdownMenuItem onClick={() => handleResolveDispute(dispute.id)} className="text-green-600">
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Resolved
                            </DropdownMenuItem>
                          )}
                          {dispute.status !== "Escalated" && dispute.status !== "Resolved" && (
                            <DropdownMenuItem onClick={() => handleEscalate(dispute.id)} className="text-orange-600">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              Escalate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredDisputes.length === 0 && (
            <Card className="border-2 border-dashed text-center py-12 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent>
                <div className="text-4xl mb-4">✨</div>
                <p className="text-lg font-semibold text-green-900 mb-2">All Disputes Resolved!</p>
                <p className="text-muted-foreground">No {statusFilter !== "all" ? statusFilter.toLowerCase() : ""} disputes at the moment</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
