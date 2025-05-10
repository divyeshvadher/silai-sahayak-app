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
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: () => void;
}

export const AddInventoryDialog = ({ 
  open, 
  onOpenChange,
  onItemAdded
}: AddInventoryDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    type: "Fabric",
    quantity: "",
    unit: "meters",
    minQuantity: "10" // Threshold for low stock
  });
  
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.quantity) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      
      const quantity = parseInt(formData.quantity);
      const minQuantity = parseInt(formData.minQuantity);
      
      const { error } = await supabase
        .from("inventory")
        .insert({
          name: formData.name,
          type: formData.type,
          quantity: quantity,
          unit: formData.unit,
          min_quantity: minQuantity,
          status: quantity <= minQuantity ? "Low Stock" : "In Stock"
        });

      if (error) throw error;

      toast.success("Item added successfully");
      onItemAdded();
      onOpenChange(false);
      setFormData({
        name: "",
        type: "Fabric",
        quantity: "",
        unit: "meters",
        minQuantity: "10"
      });
    } catch (error: any) {
      toast.error(`Failed to add item: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Item</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Item Name*</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter item name"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => handleSelectChange("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fabric">Fabric</SelectItem>
                <SelectItem value="Thread">Thread</SelectItem>
                <SelectItem value="Button">Button</SelectItem>
                <SelectItem value="Zipper">Zipper</SelectItem>
                <SelectItem value="Accessory">Accessory</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantity*</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => handleSelectChange("unit", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="meters">meters</SelectItem>
                  <SelectItem value="yards">yards</SelectItem>
                  <SelectItem value="pieces">pieces</SelectItem>
                  <SelectItem value="spools">spools</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="minQuantity">Low Stock Threshold</Label>
            <Input
              id="minQuantity"
              name="minQuantity"
              type="number"
              value={formData.minQuantity}
              onChange={handleInputChange}
              placeholder="Enter minimum quantity"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Adding..." : "Add Item"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};