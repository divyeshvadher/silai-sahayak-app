
import { Users, DollarSign, Package, ShoppingBag } from "lucide-react";
import StatusSummary from "../StatusSummary";

interface BusinessStatsProps {
  customerCount: number;
  monthlyRevenue: number;
}

const BusinessStats = ({ customerCount, monthlyRevenue }: BusinessStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatusSummary 
        title="Total Orders" 
        count={24} 
        trend={{ percentage: 10, isPositive: true }}
        icon={<ShoppingBag size={20} className="text-purple-600" />} 
        color="text-purple-600 bg-purple-50" 
      />
      <StatusSummary 
        title="Total Customers" 
        count={customerCount} 
        trend={{ percentage: 5, isPositive: true }}
        icon={<Users size={20} className="text-blue-600" />} 
        color="text-blue-600 bg-blue-50" 
      />
      <StatusSummary 
        title="Inventory Items" 
        count={18} 
        subtitle="3 items low in stock"
        icon={<Package size={20} className="text-amber-600" />} 
        color="text-amber-600 bg-amber-50" 
      />
      <StatusSummary 
        title="Revenue" 
        count={`₹${monthlyRevenue.toLocaleString()}`}
        trend={{ percentage: 12, isPositive: true }}
        icon={<DollarSign size={20} className="text-green-600" />} 
        color="text-green-600 bg-green-50" 
      />
    </div>
  );
};

export default BusinessStats;
