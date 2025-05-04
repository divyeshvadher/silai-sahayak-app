
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Order, OrderStats } from "@/types/dashboard";

// Helper function to validate order status
const validateOrderStatus = (status: string): "pending" | "in-progress" | "completed" | "delivered" => {
  if (status === "pending" || status === "in-progress" || status === "completed" || status === "delivered") {
    return status as "pending" | "in-progress" | "completed" | "delivered";
  }
  return "pending"; // Default fallback
};

export const useDashboardData = () => {
  const { user } = useAuth();
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  
  // Fetch orders and statistics
  useEffect(() => {
    const fetchOrdersAndStats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Fetch all orders to calculate statistics
        const { data: allOrdersData, error: allOrdersError } = await supabase
          .from("orders")
          .select("*");
          
        if (allOrdersError) {
          throw allOrdersError;
        }
        
        if (allOrdersData) {
          // Calculate order statistics
          const stats: OrderStats = {
            total: allOrdersData.length,
            pending: allOrdersData.filter(order => order.status === "pending").length,
            inProgress: allOrdersData.filter(order => order.status === "in-progress").length,
            completed: allOrdersData.filter(order => 
              order.status === "completed" || order.status === "delivered"
            ).length
          };
          
          setOrderStats(stats);
          
          // Filter today's orders and ensure proper status type
          const todaysOrdersData = allOrdersData
            .filter(order => order.due_date === today)
            .map(order => ({
              id: order.id,
              customer_name: order.customer_name,
              garment_type: order.garment_type,
              due_date: order.due_date,
              status: validateOrderStatus(order.status)
            }));
          
          setTodaysOrders(todaysOrdersData);
          
          // Calculate monthly revenue (from the price field)
          const revenue = allOrdersData.reduce((sum, order) => sum + (order.price || 0), 0);
          setMonthlyRevenue(revenue);
          
          // Calculate unique customer count by extracting unique customer names from orders
          const uniqueCustomers = new Set(allOrdersData.map(order => order.customer_name));
          setCustomerCount(uniqueCustomers.size);
        }
      } catch (error: any) {
        toast.error(`Error loading dashboard data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrdersAndStats();
    
    // Set up a real-time subscription
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          // When any order changes, refresh the data
          fetchOrdersAndStats();
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, today]);

  return {
    todaysOrders,
    orderStats,
    customerCount,
    monthlyRevenue,
    loading
  };
};
