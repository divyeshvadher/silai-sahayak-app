
import { Users, CreditCard } from "lucide-react";
import StatusSummary from "../StatusSummary";

interface BusinessStatsProps {
  customerCount: number;
  monthlyRevenue: number;
}

const BusinessStats = ({ customerCount, monthlyRevenue }: BusinessStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
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
    </div>
  );
};

export default BusinessStats;
