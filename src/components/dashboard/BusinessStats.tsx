
import { Users, CreditCard, Scissors } from "lucide-react";
import StatusSummary from "../StatusSummary";

interface BusinessStatsProps {
  customerCount: number;
  monthlyRevenue: number;
}

const BusinessStats = ({ customerCount, monthlyRevenue }: BusinessStatsProps) => {
  return (
    <div className="space-y-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-white/90">Business Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatusSummary 
          title="Total Customers" 
          count={customerCount} 
          icon={<Users size={20} className="text-pink-400" />} 
          color="border-pink-500"
          trend={{ percentage: 5, isPositive: true }}
          bgClass="from-pink-500/20 to-pink-700/20"
        />
        <StatusSummary 
          title="Monthly Revenue" 
          count={`₹${monthlyRevenue.toLocaleString()}`} 
          icon={<CreditCard size={20} className="text-[hsl(var(--silai-highlight))]" />} 
          color="border-[hsl(var(--silai-highlight))]"
          trend={{ percentage: 15, isPositive: true }}
          bgClass="from-emerald-500/20 to-emerald-700/20"
        />
        <StatusSummary 
          title="Inventory Status" 
          count="28 Items Low" 
          icon={<Scissors size={20} className="text-amber-400" />} 
          color="border-amber-500"
          trend={{ percentage: 12, isPositive: false }}
          bgClass="from-amber-500/20 to-amber-700/20"
        />
      </div>
    </div>
  );
};

export default BusinessStats;
