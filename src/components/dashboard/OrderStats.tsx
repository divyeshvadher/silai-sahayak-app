
import { TrendingUp, Clock, Scissors, Check } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { OrderStats as OrderStatsType } from "@/types/dashboard";

interface OrderStatsProps {
  orderStats: OrderStatsType;
}

const OrderStats = ({ orderStats }: OrderStatsProps) => {
  return (
    <div className="space-y-4 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white/90">Orders at a Glance</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatusSummary 
          title="Total Orders" 
          count={orderStats.total} 
          icon={<TrendingUp size={20} className="text-primary" />} 
          color="border-primary"
          trend={{ percentage: 12, isPositive: true }}
          bgClass="from-purple-500/20 to-purple-700/20"
        />
        <StatusSummary 
          title="Pending" 
          count={orderStats.pending} 
          icon={<Clock size={20} className="text-amber-400" />} 
          color="border-amber-500"
          bgClass="from-amber-500/20 to-amber-700/20"
        />
        <StatusSummary 
          title="In Progress" 
          count={orderStats.inProgress} 
          icon={<Scissors size={20} className="text-cyan-400" />} 
          color="border-cyan-500"
          bgClass="from-cyan-500/20 to-cyan-700/20"
        />
        <StatusSummary 
          title="Completed" 
          count={orderStats.completed} 
          icon={<Check size={20} className="text-[hsl(var(--silai-highlight))]" />} 
          color="border-[hsl(var(--silai-highlight))]"
          trend={{ percentage: 8, isPositive: true }}
          bgClass="from-emerald-500/20 to-emerald-700/20"
        />
      </div>
    </div>
  );
};

export default OrderStats;
