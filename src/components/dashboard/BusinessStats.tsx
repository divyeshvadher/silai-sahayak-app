
import { Users, DollarSign, Package } from "lucide-react";
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
        subtitle="+10% from last month"
        icon={<Package size={20} className="text-gray-600" />} 
      />
      <StatusSummary 
        title="Total Customers" 
        count={customerCount} 
        subtitle="+5% from last month"
        icon={<Users size={20} className="text-gray-600" />} 
      />
      <StatusSummary 
        title="Inventory Items" 
        count={18} 
        subtitle="3 items low in stock"
        icon={<Package size={20} className="text-gray-600" />} 
      />
      <StatusSummary 
        title="Revenue" 
        count={`₹${monthlyRevenue.toLocaleString()}`}
        subtitle="+12% from last month" 
        icon={<DollarSign size={20} className="text-gray-600" />} 
      />
    </div>
  );
};

export default BusinessStats;
