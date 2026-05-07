import "../../styles/index.css";
import { useState } from "react";
import { Bell, LogOut, Settings } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface AdminHeaderProps {
  onLogout?: () => void;
}

export function AdminHeader({ onLogout }: AdminHeaderProps) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notifyNewRequests, setNotifyNewRequests] = useState(true);
  const [notifyFlaggedListings, setNotifyFlaggedListings] = useState(true);
  const [autoArchiveResolved, setAutoArchiveResolved] = useState(false);
  const notifications = [
    { id: "n1", title: "New borrow request received", time: "2m ago" },
    { id: "n2", title: "Listing flagged for review", time: "15m ago" },
    { id: "n3", title: "User verification pending", time: "1h ago" },
  ];
  const unreadCount = notifications.length;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-gradient-to-r from-background to-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 h-16 max-w-7xl flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="white" />
              <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold">Lendly</h1>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative hover:bg-primary/10 transition-all hover:scale-110"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-primary" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white shadow">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">Notifications</div>
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1">
                  <span className="text-sm font-medium text-foreground">{notification.title}</span>
                  <span className="text-xs text-muted-foreground">{notification.time}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => toast.message("All caught up")}>Mark all as read</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings */}
          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hidden sm:flex hover:bg-primary/10 transition-all hover:scale-110"
                aria-label="Settings"
              >
                <Settings className="h-5 w-5 text-primary" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Admin Settings</DialogTitle>
                <DialogDescription>Configure how the admin console behaves.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <Label htmlFor="setting-new-requests" className="text-sm font-semibold">New borrow requests</Label>
                    <p className="text-xs text-muted-foreground">Send alerts for incoming requests.</p>
                  </div>
                  <Switch
                    id="setting-new-requests"
                    checked={notifyNewRequests}
                    onCheckedChange={setNotifyNewRequests}
                  />
                </div>
                <div className="flex items-center justify-between gap-4 rounded-lg border p-3">
                  <div>
                    <Label htmlFor="setting-flagged-listings" className="text-sm font-semibold">Flagged listing alerts</Label>
                    <p className="text-xs text-muted-foreground">Notify when listings need review.</p>
                  </div>
                  <Switch
                    id="setting-flagged-listings"
                    checked={notifyFlaggedListings}
                    onCheckedChange={setNotifyFlaggedListings}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => toast.message("Settings reset to defaults")}
                >
                  Reset
                </Button>
                <DialogClose asChild>
                  <Button
                    onClick={() => toast.success("Settings saved")}
                  >
                    Save changes
                  </Button>
                </DialogClose>
              </div>
            </DialogContent>
          </Dialog>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full p-0 hover:bg-primary/10 transition-all"
              >
                <Avatar className="h-10 w-10 border-2 border-primary/20 hover:border-primary/50 transition-all cursor-pointer">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">Admin User</span>
                  <span className="text-xs text-muted-foreground">admin@platform.com</span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-destructive focus:text-destructive"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
