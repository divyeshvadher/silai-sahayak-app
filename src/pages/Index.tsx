
import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import BusinessStats from "@/components/dashboard/BusinessStats";
import OrderStats from "@/components/dashboard/OrderStats";
import { useDashboardData } from "@/hooks/use-dashboard-data";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

const Index = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { orderStats, customerCount, monthlyRevenue, loading, getDataForDate } = useDashboardData();

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      getDataForDate(selectedDate);
    }
  };

  const handleNewOrder = () => {
    navigate("/orders/new");
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <div className="flex gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  {date ? (
                    format(date, "PPP")
                  ) : (
                    <span>Select date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            <Button className="bg-gray-900 hover:bg-gray-800" onClick={handleNewOrder}>
              New Order
            </Button>
          </div>
        </div>
        
        {/* Business statistics */}
        <BusinessStats customerCount={customerCount} monthlyRevenue={monthlyRevenue} />
        
        {/* Order statistics */}
        <OrderStats orderStats={orderStats} />
      </div>
    </Layout>
  );
};

export default Index;
