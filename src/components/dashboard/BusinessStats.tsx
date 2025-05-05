
import { Users, CreditCard, Scissors } from "lucide-react";
import StatusSummary from "../StatusSummary";

interface BusinessStatsProps {
  customerCount: number;
  monthlyRevenue: number;
}

const BusinessStats = ({ customerCount, monthlyRevenue }: BusinessStatsProps) => {
  return (
    <div className="space-y-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <StatusSummary 
          title="Total Customers" 
          count={customerCount} 
          icon={<Users size={20} className="text-accent" />} 
          color="border-accent"
          trend={{ percentage: 5, isPositive: true }}
        />
        <StatusSummary 
          title="Monthly Revenue" 
          count={`₹${monthlyRevenue.toLocaleString()}`} 
          icon={<CreditCard size={20} className="text-[hsl(var(--silai-highlight))]" />} 
          color="border-[hsl(var(--silai-highlight))]"
          trend={{ percentage: 15, isPositive: true }}
        />
        <StatusSummary 
          title="Inventory Status" 
          count="28 Items Low" 
          icon={<Scissors size={20} className="text-amber-500" />} 
          color="border-amber-500"
          trend={{ percentage: 12, isPositive: false }}
        />
      </div>
    </div>
  );
};

export default BusinessStats;
