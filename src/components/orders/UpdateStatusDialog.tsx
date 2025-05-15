
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

type UpdateStatusDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  currentStatus: "pending" | "in-progress" | "completed" | "delivered";
  newStatus: "pending" | "in-progress" | "completed" | "delivered";
  setNewStatus: (status: "pending" | "in-progress" | "completed" | "delivered") => void;
  onStatusUpdate: (status: "pending" | "in-progress" | "completed" | "delivered") => void;
};

export const UpdateStatusDialog = ({ 
  open, 
  onOpenChange, 
  orderId, 
  currentStatus,
  newStatus, 
  setNewStatus,
  onStatusUpdate
}: UpdateStatusDialogProps) => {
  
  const handleUpdateStatus = async () => {
    if (!orderId) return;
    
    try {
      const { error } = await supabase
        .from("orders")
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq("id", orderId);
        
      if (error) throw error;
      
      toast.success("Order status updated successfully");
      onStatusUpdate(newStatus);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded" onClick={handleUpdateStatus}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
