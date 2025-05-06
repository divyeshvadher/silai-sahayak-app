
import { useState, useEffect } from "react";
import { TrendingUp, Clock, Calendar } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { OrderStats as OrderStatsType } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OrderCard from "../OrderCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OrderStatsProps {
  orderStats: OrderStatsType;
}

const OrderStats = ({ orderStats }: OrderStatsProps) => {
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get recent orders (last 7 days)
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        
        const { data: recentData } = await supabase
          .from('orders')
          .select('*')
          .gte('created_at', sevenDaysAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(5);
        
        setRecentOrders(recentData || []);
        
        // Get upcoming deliveries (due in the next 7 days)
        const sevenDaysLater = new Date(today);
        sevenDaysLater.setDate(today.getDate() + 7);
        
        const { data: upcomingData } = await supabase
          .from('orders')
          .select('*')
          .lte('due_date', sevenDaysLater.toISOString())
          .gt('due_date', today.toISOString())
          .order('due_date', { ascending: true })
          .limit(5);
        
        setUpcomingDeliveries(upcomingData || []);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          fetchOrders();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div className="mb-8">
      <Card className="border shadow-sm">
        <Tabs defaultValue="recent" className="w-full">
          <TabsList className="w-full border-b rounded-none bg-transparent">
            <TabsTrigger 
              value="recent"
              className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Clock size={16} className="mr-2" />
              Recent Orders
            </TabsTrigger>
            <TabsTrigger 
              value="upcoming"
              className="flex-1 rounded-b-none data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              <Calendar size={16} className="mr-2" />
              Upcoming Deliveries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recent" className="p-4">
            <h3 className="text-lg font-medium mb-2">Recent Orders</h3>
            <p className="text-gray-500 mb-4">You have {recentOrders.length} orders this week</p>
            
            {loading ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Loading orders...</p>
              </div>
            ) : recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <OrderCard 
                    key={order.id}
                    id={order.id}
                    customerName={order.customer_name}
                    garmentType={order.garment_type}
                    dueDate={order.due_date}
                    status={order.status}
                  />
                ))}
                
                <div className="pt-2">
                  <Link to="/orders" className="text-primary text-sm font-medium hover:underline">
                    View all orders →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">No recent orders found</p>
                <Link to="/orders/new">
                  <Button>Create New Order</Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming" className="p-4">
            <h3 className="text-lg font-medium mb-2">Upcoming Deliveries</h3>
            <p className="text-gray-500 mb-4">You have {upcomingDeliveries.length} deliveries due soon</p>
            
            {loading ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Loading deliveries...</p>
              </div>
            ) : upcomingDeliveries.length > 0 ? (
              <div className="space-y-3">
                {upcomingDeliveries.map(order => (
                  <OrderCard 
                    key={order.id}
                    id={order.id}
                    customerName={order.customer_name}
                    garmentType={order.garment_type}
                    dueDate={order.due_date}
                    status={order.status}
                  />
                ))}
                
                <div className="pt-2">
                  <Link to="/orders" className="text-primary text-sm font-medium hover:underline">
                    View all deliveries →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500">No upcoming deliveries</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default OrderStats;
