
import { Calendar, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import OrderCard from "../OrderCard";
import { Card, CardContent } from "@/components/ui/card";

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
    <Card className="mb-6 border-none shadow-md">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-silai-50 to-silai-100 p-4 rounded-t-lg">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-silai-700" />
              <h2 className="text-lg font-semibold text-silai-800">Today's Orders</h2>
            </div>
            <Link to="/orders" className="text-silai-600 text-sm font-medium flex items-center hover:text-silai-800 transition-colors">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
        </div>
        
        <div className="p-4">
          {loading ? (
            <div className="py-8 text-center">
              <p className="text-gray-500">Loading orders...</p>
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
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500 mb-2">No orders for today</p>
              <Link to="/orders/new" className="text-silai-600 font-medium hover:text-silai-800 transition-colors inline-block">
                Add new order
              </Link>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysOrders;
