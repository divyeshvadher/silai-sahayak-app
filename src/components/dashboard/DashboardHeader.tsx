
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Bell, Globe, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

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
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          {greeting}, <span className="text-silai-600">{userName}</span>!
        </h1>
        <p className="text-gray-600">
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
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Globe size={18} />
              <span className="sr-only">Switch language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => handleLanguageChange("English")}
              className={language === "English" ? "bg-muted" : ""}
            >
              English
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => handleLanguageChange("Gujarati")}
              className={language === "Gujarati" ? "bg-muted" : ""}
            >
              ગુજરાતી (Gujarati)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9 rounded-full">
              <Bell size={18} />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-4 text-center text-sm text-muted-foreground">
              No new notifications
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* New Order Button */}
        <Link to="/orders/new">
          <Button className="bg-silai-600 hover:bg-silai-700 shadow-md transition-all hover:shadow-lg">
            <Plus size={18} className="mr-1" />
            New Order
          </Button>
        </Link>
      </div>
    </div>
  );
};
