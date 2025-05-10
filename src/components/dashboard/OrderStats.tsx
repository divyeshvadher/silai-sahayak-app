import { useState, useEffect } from "react";
import { Clock, Calendar } from "lucide-react";
import StatusSummary from "../StatusSummary";
import { OrderStats as OrderStatsType } from "@/types/dashboard";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import OrderCard from "../OrderCard";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface OrderStatsProps {
  orderStats: OrderStatsType;
}

const OrderStats = ({ orderStats }: OrderStatsProps) => {
  const [upcomingDeliveries, setUpcomingDeliveries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Get upcoming deliveries (due in the next 7 days)
        const today = new Date();
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
    <Card className="border shadow-sm">
      <div className="p-4">
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
      </div>
    </Card>
  );
};

export default OrderStats;