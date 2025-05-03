
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardHeader = () => {
  const [greeting, setGreeting] = useState<string>("");
  
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else setGreeting("Good Evening");
  }, []);

  return (
    <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{greeting}!</h1>
        <p className="text-gray-600">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
          })}
        </p>
      </div>
      <div className="mt-4 md:mt-0">
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
