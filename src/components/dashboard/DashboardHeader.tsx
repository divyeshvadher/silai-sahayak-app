
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Globe, Plus, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const DashboardHeader = () => {
  const [greeting, setGreeting] = useState<string>("");
  const [language, setLanguage] = useState<"English" | "Gujarati">("English");
  const { profile } = useAuth();
  const userName = profile?.full_name || "Tailor";
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  // Switch language
  const handleLanguageChange = (lang: "English" | "Gujarati") => {
    setLanguage(lang);
    // Here you would implement actual language switching logic
  };

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold mb-1">
          {greeting}, <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{userName}</span>!
        </h1>
        <p className="text-gray-400">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-3">
        {/* Language Switcher */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
              <Globe size={18} />
              <span className="sr-only">Switch language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
            <DropdownMenuItem 
              onClick={() => handleLanguageChange("English")}
              className={`${language === "English" ? "bg-gray-700" : ""} hover:bg-gray-700`}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLanguageChange("Gujarati")}
              className={`${language === "Gujarati" ? "bg-gray-700" : ""} hover:bg-gray-700`}
            >
              ગુજરાતી (Gujarati)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
              <Bell size={18} />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 bg-gray-800 border-gray-700">
            <div className="p-4 text-center text-sm text-gray-400">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Profile Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-9 w-9 p-0 rounded-full border-gray-700 bg-gray-800/50 hover:bg-gray-700/50">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} alt={profile?.full_name || ''} />
                <AvatarFallback className="bg-primary/20 text-primary">
                  {profile?.full_name ? profile.full_name[0].toUpperCase() : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
            <Link to="/profile">
              <DropdownMenuItem className="hover:bg-gray-700">
                My Profile
              </DropdownMenuItem>
            </Link>
            <Link to="/settings">
              <DropdownMenuItem className="hover:bg-gray-700">
                Settings
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* New Order Button */}
        <Link to="/orders/new">
          <Button className="bg-gradient-to-r from-purple-600 to-cyan-500 hover:from-purple-700 hover:to-cyan-600 shadow-md transition-all hover:shadow-lg btn-glow">
            <Plus size={18} className="mr-1" />
            New Order
          </Button>
        </Link>
      </div>
    </div>
  );
};
