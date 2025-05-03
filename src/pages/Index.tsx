
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StatusSummary from "../components/StatusSummary";
import OrderCard from "../components/OrderCard";
import { Calendar, Clock, Check, FileText, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

// Type definition for orders
type Order = {
  id: string;
  customer_name: string;
  garment_type: string;
  due_date: string;
  status: "pending" | "in-progress" | "completed" | "delivered";
};

// Type for order statistics
type OrderStats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
};

// Helper function to validate order status
const validateOrderStatus = (status: string): "pending" | "in-progress" | "completed" | "delivered" => {
  if (status === "pending" || status === "in-progress" || status === "completed" || status === "delivered") {
    return status as "pending" | "in-progress" | "completed" | "delivered";
  }
  return "pending"; // Default fallback
};

const Index = () => {
  const { user } = useAuth();
  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [orderStats, setOrderStats] = useState<OrderStats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0
  });
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
        }
      } catch (error: any) {
        toast.error(`Error loading orders: ${error.message}`);
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

  return (
    <Layout>
      <div className="silai-container animate-fade-in">
        <DashboardHeader />
        
        {/* Status summaries */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatusSummary 
            title="Total Orders" 
            count={orderStats.total} 
            icon={<TrendingUp size={20} className="text-silai-600" />} 
            color="border-silai-600"
          />
          <StatusSummary 
            title="Pending" 
            count={orderStats.pending} 
            icon={<Clock size={20} className="text-amber-500" />} 
            color="border-amber-500"
          />
          <StatusSummary 
            title="In Progress" 
            count={orderStats.inProgress} 
            icon={<FileText size={20} className="text-blue-500" />} 
            color="border-blue-500"
          />
          <StatusSummary 
            title="Completed" 
            count={orderStats.completed} 
            icon={<Check size={20} className="text-jade-500" />} 
            color="border-jade-500"
          />
        </div>
        
        {/* Today's Orders */}
        <Card className="mb-6 border-none shadow-md">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-silai-50 to-silai-100 p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className="text-silai-700" />
                  <h2 className="text-lg font-semibold text-silai-800">Today's Orders</h2>
                </div>
                <Link to="/orders" className="text-silai-600 text-sm font-medium flex items-center hover:text-silai-800 transition-colors">
                  View All <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="py-8 text-center">
                  <p className="text-gray-500">Loading orders...</p>
                </div>
              ) : todaysOrders.length > 0 ? (
                <div className="space-y-3">
                  {todaysOrders.map(order => (
                    <OrderCard 
                      key={order.id}
                      id={order.id}
                      customerName={order.customer_name}
                      garmentType={order.garment_type}
                      dueDate={order.due_date}
                      status={order.status}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-gray-50 rounded-lg">
                  <p className="text-gray-500 mb-2">No orders for today</p>
                  <Link to="/orders/new" className="text-silai-600 font-medium hover:text-silai-800 transition-colors inline-block">
                    Add new order
                  </Link>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Index;
