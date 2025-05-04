
import { TrendingUp, Clock, FileText, Check } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { OrderStats as OrderStatsType } from "@/types/dashboard";

interface OrderStatsProps {
  orderStats: OrderStatsType;
}

const OrderStats = ({ orderStats }: OrderStatsProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
      <StatusSummary 
        title="Total Orders" 
        count={orderStats.total} 
        icon={<TrendingUp size={20} className="text-silai-600" />} 
        color="border-silai-600"
        trend={{ percentage: 12, isPositive: true }}
      />
      <StatusSummary 
        title="Pending" 
        count={orderStats.pending} 
        icon={<Clock size={20} className="text-amber-500" />} 
        color="border-amber-500"
      />
      <StatusSummary 
        title="In Progress" 
        count={orderStats.inProgress} 
        icon={<FileText size={20} className="text-blue-500" />} 
        color="border-blue-500"
      />
      <StatusSummary 
        title="Completed" 
        count={orderStats.completed} 
        icon={<Check size={20} className="text-jade-500" />} 
        color="border-jade-500"
        trend={{ percentage: 8, isPositive: true }}
      />
    </div>
  );
};

export default OrderStats;
