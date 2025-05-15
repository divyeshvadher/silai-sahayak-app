import { useState, useEffect } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Database } from "@/lib/supabase";
import { supabase } from "@/lib/utils";
import { Order } from "./columns";

type Measurement = {
  name: string;
  value: string;
  unit: string;
};

interface EditOrderProps {
  open: boolean;
  onClose: () => void;
  order: Order;
  onUpdate: () => void;
}

const defaultMeasurements: Measurement[] = [
  { name: "Chest", value: "", unit: "inch" },
  { name: "Waist", value: "", unit: "inch" },
  { name: "Hips", value: "", unit: "inch" },
  { name: "Sleeve Length", value: "", unit: "inch" },
];

export function EditOrderDialog({ open, onClose, order, onUpdate }: EditOrderProps) {
  const [measurements, setMeasurements] = useState<Measurement[]>(defaultMeasurements);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMeasurements = async () => {
      if (!order?.id) return;

      const { data, error } = await supabase
        .from("measurements")
        .select("*")
        .eq("order_id", order.id);

      if (error) {
        toast.error("Failed to fetch measurements");
        return;
      }

      if (data.length > 0) {
        const formatted = defaultMeasurements.map((m) => {
          const found = data.find((d) => d.name === m.name);
          return found
            ? { name: found.name, value: found.value, unit: found.unit }
            : m;
        });
        setMeasurements(formatted);
      } else {
        setMeasurements(defaultMeasurements);
      }
    };

    if (open) {
      fetchMeasurements();
    }
  }, [open, order.id]);

  const handleChange = (index: number, value: string) => {
    const updated = [...measurements];
    updated[index].value = value;
    setMeasurements(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const updates = {
        id: order.id,
        customer_name: order.customer_name,
        status: order.status,
        // add other order fields if needed
      };

      const { error: orderError } = await supabase
        .from("orders")
        .update(updates)
        .eq("id", order.id);

      if (orderError) throw orderError;

      const measurementUpdates = measurements.map((m) => ({
        order_id: order.id,
        name: m.name,
        value: m.value,
        unit: m.unit,
      }));

      const { error: measurementError } = await supabase
        .from("measurements")
        .upsert(measurementUpdates, { onConflict: ['order_id', 'name'] });

      if (measurementError) throw measurementError;

      toast.success("Order updated successfully");
      onUpdate();
      onClose();
    } catch (err) {
      toast.error("Failed to update order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] flex flex-col max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Order</DialogTitle>
        </DialogHeader>

        {/* Scrollable area */}
        <ScrollArea className="flex-1 overflow-auto px-1">
          <div className="space-y-4 pb-4">
            {measurements.map((m, index) => (
              <div key={m.name} className="grid grid-cols-3 gap-2 items-center">
                <Label className="col-span-1">{m.name}</Label>
                <Input
                  className="col-span-1"
                  value={m.value}
                  onChange={(e) => handleChange(index, e.target.value)}
                  placeholder="Enter value"
                />
                <span className="col-span-1 text-sm text-muted-foreground">{m.unit}</span>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Sticky footer */}
        <div className="mt-4 flex justify-end sticky bottom-0 bg-white border-t pt-4">
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
