
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Phone, Scissors, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [editedOrder, setEditedOrder] = useState<Partial<OrderDetail>>({});
  const [newStatus, setNewStatus] = useState<"pending" | "in-progress" | "completed" | "delivered">("pending");

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
        }
      } catch (error: any) {
        toast.error(`Error loading order details: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrderDetails();
  }, [id]);
  
  const handleUpdateStatus = async () => {
    if (!id || !order) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success("Order status updated successfully");
      setOrder({
        ...order,
        status: newStatus,
        updated_at: new Date().toISOString()
      });
      
      setStatusDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };
  
  const handleEditOrder = async () => {
    if (!id || !editedOrder) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({
          customer_name: editedOrder.customer_name,
          phone_number: editedOrder.phone_number,
          garment_type: editedOrder.garment_type,
          fabric_type: editedOrder.fabric_type,
          due_date: editedOrder.due_date,
          delivery_date: editedOrder.delivery_date,
          price: editedOrder.price,
          advance_paid: editedOrder.advance_paid,
          notes: editedOrder.notes,
          priority_level: editedOrder.priority_level,
          updated_at: new Date().toISOString()
        })
        .eq("id", id);
        
      if (error) throw error;
      
      toast.success("Order updated successfully");
      setOrder({
        ...order!,
        ...editedOrder,
        updated_at: new Date().toISOString()
      } as OrderDetail);
      
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditedOrder(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Status styling for the badge
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700",
    "in-progress": "bg-blue-50 text-blue-700",
    completed: "bg-jade-50 text-jade-600",
    delivered: "bg-gray-50 text-gray-600",
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
            <div className="silai-card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{order.garment_type}</h2>
                  <div className="flex items-center mt-1">
                    <User size={16} className="text-gray-500 mr-1" />
                    <span className="text-gray-700">{order.customer_name}</span>
                  </div>
                  {order.phone_number && (
                    <div className="flex items-center mt-1">
                      <Phone size={16} className="text-gray-500 mr-1" />
                      <span className="text-gray-600">{order.phone_number}</span>
                    </div>
                  )}
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm ${statusStyles[order.status]}`}>
                  {order.status.replace('-', ' ')}
                </div>
              </div>
              
              {/* Important dates */}
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p className="font-medium flex items-center">
                      <Clock size={15} className="mr-1 text-amber-500" />
                      {formatDate(order.due_date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Delivery Date</p>
                    <p className="font-medium">{formatDate(order.delivery_date)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Garment details */}
            <div className="silai-card">
              <h3 className="font-medium text-gray-700 mb-3 flex items-center">
                <Scissors size={16} className="mr-1" />
                Garment Details
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-500">Fabric Type</p>
                  <p className="font-medium">{order.fabric_type || "Not specified"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Fabric Provided By</p>
                  <p className="font-medium capitalize">{order.fabric_provided_by}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Priority Level</p>
                  <p className="font-medium capitalize">{order.priority_level}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Created On</p>
                  <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
            
            {/* Payment details */}
            <div className="silai-card">
              <h3 className="font-medium text-gray-700 mb-3">Payment Details</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <p className="text-sm text-gray-500">Total Price</p>
                  <p className="font-medium">₹{order.price}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Advance Paid</p>
                  <p className="font-medium">₹{order.advance_paid || 0}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Balance Due</p>
                <p className="font-medium text-lg text-silai-700">₹{calculateBalance()}</p>
              </div>
            </div>
            
            {/* Notes */}
            {order.notes && (
              <div className="silai-card">
                <h3 className="font-medium text-gray-700 mb-2">Notes</h3>
                <p className="text-gray-600">{order.notes}</p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex space-x-3 pt-2">
              <Button 
                className="bg-silai-600 hover:bg-silai-700 flex-1" 
                onClick={() => setEditDialogOpen(true)}
              >
                Edit Order
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
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
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  name="customer_name"
                  value={editedOrder.customer_name || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  value={editedOrder.phone_number || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="garment_type">Garment Type</Label>
                <Input
                  id="garment_type"
                  name="garment_type"
                  value={editedOrder.garment_type || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="fabric_type">Fabric Type</Label>
                <Input
                  id="fabric_type"
                  name="fabric_type"
                  value={editedOrder.fabric_type || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  name="due_date"
                  type="date"
                  value={editedOrder.due_date ? new Date(editedOrder.due_date).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="delivery_date">Delivery Date</Label>
                <Input
                  id="delivery_date"
                  name="delivery_date"
                  type="date"
                  value={editedOrder.delivery_date ? new Date(editedOrder.delivery_date).toISOString().split('T')[0] : ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={editedOrder.price || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="advance_paid">Advance Paid</Label>
                <Input
                  id="advance_paid"
                  name="advance_paid"
                  type="number"
                  value={editedOrder.advance_paid || ''}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="priority_level">Priority Level</Label>
              <Select 
                name="priority_level"
                value={editedOrder.priority_level || 'normal'}
                onValueChange={(value) => handleSelectChange('priority_level', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={editedOrder.notes || ''}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button className="bg-silai-600 hover:bg-silai-700" onClick={handleEditOrder}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Update Status Dialog */}
      <Dialog open={statusDialogOpen} onOpenChange={setStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="status">Order Status</Label>
            <Select 
              value={newStatus}
              onValueChange={(value) => setNewStatus(value as "pending" | "in-progress" | "completed" | "delivered")}
            >
              <SelectTrigger className="w-full mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusDialogOpen(false)}>Cancel</Button>
            <Button className="bg-silai-600 hover:bg-silai-700" onClick={handleUpdateStatus}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default OrderDetail;
