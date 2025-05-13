import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
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
import { Button } from "@/components/ui/button";

type OrderDetailType = {
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

type EditOrderDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: OrderDetailType;
  setOrder: (order: OrderDetailType) => void;
  editedOrder: Partial<OrderDetailType>;
  setEditedOrder: (order: Partial<OrderDetailType>) => void;
};

export const EditOrderDialog = ({ 
  open, 
  onOpenChange, 
  order, 
  setOrder, 
  editedOrder, 
  setEditedOrder
}: EditOrderDialogProps) => {
  const [measurements, setMeasurements] = useState([
    { name: "Chest", value: "", unit: "cm" },
    { name: "Waist", value: "", unit: "cm" },
    { name: "Hip", value: "", unit: "cm" },
    { name: "Length", value: "", unit: "cm" },
    { name: "Sleeve", value: "", unit: "cm" }
  ]);
  
  const handleEditOrder = async () => {
    if (!order.id || !editedOrder) return;
    
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
        .eq("id", order.id);
        
      if (error) throw error;

      // Update measurements
      const measurementUpdates = measurements.map(m => ({
        order_id: order.id,
        name: m.name,
        value: m.value,
        unit: m.unit
      }));

      const { error: measurementError } = await supabase
        .from("measurements")
        .upsert(measurementUpdates);

      if (measurementError) throw measurementError;
      
      toast.success("Order and measurements updated successfully");
      setOrder({
        ...order,
        ...editedOrder,
        updated_at: new Date().toISOString()
      });
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to update order: ${error.message}`);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedOrder({
      ...editedOrder,
      [name]: value
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setEditedOrder({
      ...editedOrder,
      [name]: value
    });
  };

  const handleMeasurementChange = (index: number, value: string) => {
    const updatedMeasurements = [...measurements];
    updatedMeasurements[index].value = value;
    setMeasurements(updatedMeasurements);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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

          {/* Measurements Section */}
          <div className="space-y-4">
            <Label>Measurements</Label>
            {measurements.map((measurement, index) => (
              <div key={index} className="grid grid-cols-2 gap-4">
                <Label>{measurement.name}</Label>
                <Input
                  type="number"
                  value={measurement.value}
                  onChange={(e) => handleMeasurementChange(index, e.target.value)}
                  placeholder={`Enter ${measurement.name.toLowerCase()}`}
                />
              </div>
            ))}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-silai-600 hover:bg-silai-700" onClick={handleEditOrder}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};