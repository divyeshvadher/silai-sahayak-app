
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const DashboardHeader = () => {
  const { profile } = useAuth();
  
  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-1 text-gray-800">
          Dashboard
        </h1>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-3">
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-md border-gray-200 bg-white">
              <Bell size={18} />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-white border-gray-200">
            <div className="p-4 text-center text-sm text-gray-500">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 w-9 p-0 rounded-md border-gray-200 bg-white">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-100 text-gray-600">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border-gray-200">
            <Link to="/profile">
              <DropdownMenuItem>
                My Profile
              </DropdownMenuItem>
            </Link>
            <Link to="/settings">
              <DropdownMenuItem>
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* New Order Button */}
        <Link to="/orders/new">
          <Button className="bg-gray-900 hover:bg-gray-800">
            New Order
          </Button>
        </Link>
      </div>
    </div>
  );
};
