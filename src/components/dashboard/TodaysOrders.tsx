
import { Calendar, ArrowRight, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import OrderCard from "../OrderCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Order {
  id: string;
  customer_name: string;
  garment_type: string;
  due_date: string;
  status: "pending" | "in-progress" | "completed" | "delivered";
}

interface TodaysOrdersProps {
  todaysOrders: Order[];
  loading: boolean;
}

const TodaysOrders = ({ todaysOrders, loading }: TodaysOrdersProps) => {
  return (
    <Card className="mb-6 border border-gray-800 bg-[hsl(var(--silai-card))]">
      <div className="bg-gray-900/50 p-4 rounded-t-lg border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="text-primary" />
            <h2 className="text-lg font-semibold">Today's Orders</h2>
          </div>
          <Link to="/orders" className="text-accent text-sm font-medium flex items-center hover:text-[hsl(var(--silai-highlight))] transition-colors">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
      </div>
      
      <CardContent className="p-4">
        {loading ? (
          <div className="py-8 text-center">
            <div className="w-8 h-8 border-2 border-t-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-gray-400">Loading orders...</p>
          </div>
        ) : todaysOrders.length > 0 ? (
          <div className="space-y-3">
            {todaysOrders.map(order => (
              <OrderCard 
                key={order.id}
                id={order.id}
                customerName={order.customer_name}
                garmentType={order.garment_type}
                dueDate={order.due_date}
                status={order.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-900/30 rounded-lg border border-gray-800">
            <FileText size={36} className="mx-auto mb-2 text-gray-500" />
            <p className="text-gray-400 mb-3">No orders scheduled for today</p>
            <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
              <Link to="/orders/new">
                Create New Order
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TodaysOrders;
