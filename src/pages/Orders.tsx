
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import OrderCard from "../components/OrderCard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
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

// Type for raw data from Supabase
type RawOrder = {
  id: string;
  customer_name: string;
  garment_type: string;
  due_date: string;
  status: string;
  [key: string]: any; // Allow other properties
};

const Orders = () => {
  const navigate = useNavigate();
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
          // Transform the raw data to match our Order type
          const typedOrders: Order[] = data.map((order: RawOrder) => ({
            id: order.id,
            customer_name: order.customer_name,
            garment_type: order.garment_type,
            due_date: order.due_date,
            // Ensure status is one of the allowed values, default to "pending" if not
            status: ["pending", "in-progress", "completed", "delivered"].includes(order.status) 
              ? order.status as "pending" | "in-progress" | "completed" | "delivered"
              : "pending"
          }));
          
          setOrders(typedOrders);
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
            const newOrder = payload.new as RawOrder;
            const typedNewOrder: Order = {
              id: newOrder.id,
              customer_name: newOrder.customer_name,
              garment_type: newOrder.garment_type,
              due_date: newOrder.due_date,
              status: ["pending", "in-progress", "completed", "delivered"].includes(newOrder.status) 
                ? newOrder.status as "pending" | "in-progress" | "completed" | "delivered"
                : "pending"
            };
            setOrders(prevOrders => [...prevOrders, typedNewOrder]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as RawOrder;
            const typedUpdatedOrder: Order = {
              id: updatedOrder.id,
              customer_name: updatedOrder.customer_name,
              garment_type: updatedOrder.garment_type,
              due_date: updatedOrder.due_date,
              status: ["pending", "in-progress", "completed", "delivered"].includes(updatedOrder.status) 
                ? updatedOrder.status as "pending" | "in-progress" | "completed" | "delivered"
                : "pending"
            };
            setOrders(prevOrders => 
              prevOrders.map(order => 
                order.id === typedUpdatedOrder.id ? typedUpdatedOrder : order
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

  const handleNewOrder = () => {
    navigate("/orders/new");
  };

  return (
    <Layout title="Orders">
      <div className="animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
          <Button 
            onClick={handleNewOrder}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Plus size={18} className="mr-1" />
            New Order
          </Button>
        </div>
        
        {/* Search and filter */}
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
        </div>
        
        {/* Orders list */}
        {loading ? (
          <div className="py-8 text-center">
            <p className="text-gray-500">Loading orders...</p>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-3">
            {filteredOrders.map(order => (
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
          <div className="text-center py-6">
            <p className="text-gray-500">No orders found</p>
            <Button 
              onClick={handleNewOrder}
              className="mt-4 bg-gray-900 hover:bg-gray-800"
            >
              Create New Order
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
