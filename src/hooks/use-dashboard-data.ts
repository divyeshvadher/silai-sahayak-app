
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Order, OrderStats } from "@/types/dashboard";
import { format } from "date-fns";

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
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  
  const fetchOrdersAndStats = useCallback(async (date: string) => {
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
        const ordersForSelectedDate = allOrdersData
          .filter(order => order.due_date === date)
          .map(order => ({
            id: order.id,
            customer_name: order.customer_name,
            garment_type: order.garment_type,
            due_date: order.due_date,
            status: validateOrderStatus(order.status)
          }));
        
        setTodaysOrders(ordersForSelectedDate);
        
        // Calculate monthly revenue from the selected date's month
        const selectedMonth = new Date(date).getMonth();
        const selectedYear = new Date(date).getFullYear();
        const ordersInMonth = allOrdersData.filter(order => {
          const orderDate = new Date(order.due_date);
          return orderDate.getMonth() === selectedMonth && orderDate.getFullYear() === selectedYear;
        });
        
        const revenue = ordersInMonth.reduce((sum, order) => sum + (order.price || 0), 0);
        setMonthlyRevenue(revenue);
        
        // Calculate unique customer count
        const uniqueCustomers = new Set(allOrdersData.map(order => order.customer_name));
        setCustomerCount(uniqueCustomers.size);
      }
    } catch (error: any) {
      toast.error(`Error loading dashboard data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [user]);
  
  // Get data for a specific date
  const getDataForDate = useCallback((date: Date) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    setSelectedDate(formattedDate);
    fetchOrdersAndStats(formattedDate);
  }, [fetchOrdersAndStats]);
  
  // Initial fetch on component mount
  useEffect(() => {
    fetchOrdersAndStats(selectedDate);
    
    // Set up a real-time subscription
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          // When any order changes, refresh the data
          fetchOrdersAndStats(selectedDate);
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedDate, fetchOrdersAndStats]);

  return {
    todaysOrders,
    orderStats,
    customerCount,
    monthlyRevenue,
    loading,
    getDataForDate
  };
};
