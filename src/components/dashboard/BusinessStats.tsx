import { Users, DollarSign, Package, ShoppingBag } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessStatsProps {
  customerCount: number;
  monthlyRevenue: number;
}

const BusinessStats = ({ customerCount, monthlyRevenue }: BusinessStatsProps) => {
  const [inventoryCount, setInventoryCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);

  useEffect(() => {
    const fetchInventoryStats = async () => {
      try {
        const { data: inventoryData, error } = await supabase
          .from("inventory")
          .select("*");

        if (error) throw error;

        if (inventoryData) {
          setInventoryCount(inventoryData.length);
          const lowStock = inventoryData.filter(item => item.quantity <= item.min_quantity);
          setLowStockCount(lowStock.length);
        }
      } catch (error: any) {
        toast.error(`Error loading inventory stats: ${error.message}`);
      }
    };

    fetchInventoryStats();

    // Set up real-time subscription
    const channel = supabase
      .channel("inventory_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventory" },
        () => {
          fetchInventoryStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
        count={inventoryCount} 
        subtitle={`${lowStockCount} items low in stock`}
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