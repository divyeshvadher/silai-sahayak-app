
import { Users, Wallet } from "lucide-react";
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
        icon={<Users size={20} className="text-purple-500" />} 
        color="border-purple-500"
        trend={{ percentage: 5, isPositive: true }}
      />
      <StatusSummary 
        title="Monthly Revenue" 
        count={`₹${monthlyRevenue.toLocaleString()}`} 
        icon={<Wallet size={20} className="text-emerald-500" />} 
        color="border-emerald-500"
        trend={{ percentage: 15, isPositive: true }}
      />
    </div>
  );
};

export default BusinessStats;
