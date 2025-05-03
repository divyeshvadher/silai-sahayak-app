
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import OrderCard from "../components/OrderCard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
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

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch orders from Supabase when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .order("due_date", { ascending: true });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setOrders(data);
        }
      } catch (error: any) {
        toast.error(`Error loading orders: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
    
    // Set up a real-time subscription
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setOrders(prevOrders => [...prevOrders, payload.new as Order]);
          } else if (payload.eventType === 'UPDATE') {
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === payload.new.id ? payload.new as Order : order
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setOrders(prevOrders => 
              prevOrders.filter(order => order.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
    
    // Cleanup subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.garment_type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Orders">
      <div className="silai-container">
        {/* Search and Add buttons */}
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="px-3">
            <Filter size={18} />
          </Button>
          <Link to="/orders/new">
            <Button className="bg-silai-600 hover:bg-silai-700">
              <Plus size={18} className="mr-1" />
              New
            </Button>
          </Link>
        </div>
        
        {/* Orders list */}
        {loading ? (
          <div className="silai-card py-8 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
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
            <p className="text-gray-500">No orders found</p>
            <Link to="/orders/new" className="text-silai-600 font-medium mt-2 inline-block">
              Add new order
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
