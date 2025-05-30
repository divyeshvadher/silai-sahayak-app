import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { OrderHeader } from "@/components/orders/OrderHeader";
import { GarmentDetails } from "@/components/orders/GarmentDetails";
import { PaymentDetails } from "@/components/orders/PaymentDetails";
import { OrderNotes } from "@/components/orders/OrderNotes";
import { EditOrderDialog } from "@/components/orders/EditOrderDialog";
import { UpdateStatusDialog } from "@/components/orders/UpdateStatusDialog";

type OrderDetail = {
  id: string;
  customer_name: string;
  phone_number: string | null;
  garment_type: string;
  fabric_type: string | null;
  fabric_provided_by: string;
  due_date: string;
  delivery_date: string | null;
  price: number;
  advance_paid: number | null;
  status: "pending" | "in-progress" | "completed" | "delivered";
  notes: string | null;
  priority_level: string;
  created_at: string;
  updated_at: string;
};

type Measurement = {
  id: string;
  name: string;
  value: string;
  unit: string;
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<OrderDetail>>({});
  const [newStatus, setNewStatus] = useState<"pending" | "in-progress" | "completed" | "delivered">("pending");
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loadingMeasurements, setLoadingMeasurements] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", id)
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Ensure status is one of the allowed values
          const status = ["pending", "in-progress", "completed", "delivered"].includes(data.status) 
            ? data.status as "pending" | "in-progress" | "completed" | "delivered"
            : "pending";
            
          const orderData = {
            ...data,
            status
          };
          
          setOrder(orderData);
          setEditedOrder(orderData);
          setNewStatus(orderData.status);

          // Fetch measurements for this order
          fetchMeasurements(id);
        }
      } catch (error: any) {
        toast.error(`Error loading order details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);

  const fetchMeasurements = async (orderId: string) => {
    try {
      setLoadingMeasurements(true);
      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("order_id", orderId);
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setMeasurements(data);
      }
    } catch (error: any) {
      toast.error(`Error loading measurements: ${error.message}`);
    } finally {
      setLoadingMeasurements(false);
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not set";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };
  
  // Calculate balance
  const calculateBalance = () => {
    if (!order) return 0;
    const advance = order.advance_paid || 0;
    return order.price - advance;
  };

  const handleStatusUpdate = (status: "pending" | "in-progress" | "completed" | "delivered") => {
    if (!order) return;
    setOrder({
      ...order,
      status,
      updated_at: new Date().toISOString()
    });
  };

  return (
    <Layout title="Order Details">
      <div className="silai-container">
        <Link to="/orders" className="inline-flex items-center text-silai-600 mb-4">
          <ArrowLeft size={16} className="mr-1" />
          Back to Orders
        </Link>
        
        {loading ? (
          <div className="silai-card py-8 text-center">
            <p className="text-gray-500">Loading order details...</p>
          </div>
        ) : order ? (
          <div className="space-y-5">
            {/* Header with customer info and status */}
            <OrderHeader order={order} formatDate={formatDate} />
            
            {/* Garment details */}
            <GarmentDetails order={order} />
            
            {/* Customer Measurements */}
            <div className="silai-card">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Customer Measurements</h3>
              </div>
              
              {loadingMeasurements ? (
                <p className="text-gray-500">Loading measurements...</p>
              ) : measurements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {measurements.map(measurement => (
                    <div key={measurement.id} className="bg-gray-100 p-3 rounded-md">
                      <p className="text-sm font-medium">{measurement.name}</p>
                      <p className="text-lg">{measurement.value} {measurement.unit}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No measurements recorded for this customer.</p>
              )}
            </div>
            
            {/* Payment details */}
            <PaymentDetails order={order} calculateBalance={calculateBalance} />
            
            {/* Notes */}
            <OrderNotes notes={order.notes} />
            
            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline"
                className="flex-1 bg-white hover:bg-gray-100 text-gray-900 border-gray-200"
                onClick={() => setEditDialogOpen(true)}
              >
                Edit Order
              </Button>
              <Button 
                className="flex-1 bg-primary text-white hover:bg-primary/90"
                onClick={() => setStatusDialogOpen(true)}
              >
                Update Status
              </Button>
            </div>
          </div>
        ) : (
          <div className="silai-card text-center py-6">
            <p className="text-gray-500">Order not found</p>
            <Link to="/orders" className="text-silai-600 font-medium mt-2 inline-block">
              Return to orders
            </Link>
          </div>
        )}
      </div>
      
      {/* Edit Order Dialog */}
      {order && (
        <EditOrderDialog 
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          order={order}
          setOrder={setOrder}
          editedOrder={editedOrder}
          setEditedOrder={setEditedOrder}
        />
      )}
      
      {/* Update Status Dialog */}
      {order && (
        <UpdateStatusDialog 
          open={statusDialogOpen}
          onOpenChange={setStatusDialogOpen}
          orderId={order.id}
          currentStatus={order.status}
          newStatus={newStatus}
          setNewStatus={setNewStatus}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </Layout>
  );
};

export default OrderDetail;