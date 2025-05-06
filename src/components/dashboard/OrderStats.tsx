
import { TrendingUp, Clock, Scissors, Check } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { OrderStats as OrderStatsType } from "@/types/dashboard";

interface OrderStatsProps {
  orderStats: OrderStatsType;
}

const OrderStats = ({ orderStats }: OrderStatsProps) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 border-b w-full">
          <div className="px-4 py-2 text-primary font-medium border-b-2 border-primary">
            Recent Orders
          </div>
          <div className="px-4 py-2 text-gray-500">
            Upcoming Deliveries
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
        <p className="text-gray-500 mb-4">You have 5 orders this week</p>
        
        <div className="border rounded-md p-4 mb-2 flex justify-between items-center">
          <div>
            <p className="font-medium">Order #1000</p>
            <p className="text-sm text-gray-500">Customer: John Doe</p>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-medium">₹1200</span>
            <div className="ml-4 text-gray-500">
              <Clock size={18} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderStats;
