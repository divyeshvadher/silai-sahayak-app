
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import StatusSummary from "../components/StatusSummary";
import OrderCard from "../components/OrderCard";
import { Calendar, Clock, Check, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
      <div className="silai-container">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>

        {/* Status summaries */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatusSummary 
            title="Today's Orders" 
            count={todaysOrders.length} 
            icon={<Calendar size={20} className="text-silai-600" />} 
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
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Today's Orders</h2>
          <Link to="/orders" className="text-silai-600 text-sm flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="silai-card py-8 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : todaysOrders.length > 0 ? (
          todaysOrders.map(order => (
            <OrderCard 
              key={order.id}
              id={order.id}
              customerName={order.customer_name}
              garmentType={order.garment_type}
              dueDate={order.due_date}
              status={order.status}
            />
          ))
        ) : (
          <div className="silai-card text-center py-6">
            <p className="text-gray-500">No orders for today</p>
            <Link to="/orders/new" className="text-silai-600 font-medium mt-2 inline-block">
              Add new order
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
