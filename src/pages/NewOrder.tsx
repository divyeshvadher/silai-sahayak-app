
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { CalendarIcon, Tape, Plus, Trash2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Define form validation schema
const formSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  garmentType: z.string().min(1, "Garment type is required"),
  fabricType: z.string().optional(),
  fabricProvided: z.enum(["customer", "tailor"]),
  dueDate: z.date({
    required_error: "Due date is required",
  }),
  deliveryDate: z.date().optional(),
  price: z.string().min(1, "Price is required"),
  advancePaid: z.string().optional(),
  notes: z.string().optional(),
  priorityLevel: z.enum(["normal", "rush", "urgent"]).default("normal"),
  measurements: z.array(
    z.object({
      name: z.string().min(1, "Measurement name is required"),
      value: z.string().min(1, "Value is required"),
      unit: z.string().default("cm"),
    })
  ).optional().default([]),
});

const defaultMeasurements = [
  { name: "Chest", value: "", unit: "cm" },
  { name: "Waist", value: "", unit: "cm" },
  { name: "Hip", value: "", unit: "cm" },
  { name: "Length", value: "", unit: "cm" },
  { name: "Sleeve", value: "", unit: "cm" },
];

type FormValues = z.infer<typeof formSchema>;

const NewOrder = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [customMeasurements, setCustomMeasurements] = useState<Array<{ name: string; value: string; unit: string }>>(defaultMeasurements);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      phoneNumber: "",
      garmentType: "",
      fabricType: "",
      fabricProvided: "customer",
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Default to 1 week from now
      price: "",
      advancePaid: "",
      notes: "",
      priorityLevel: "normal",
      measurements: defaultMeasurements,
    },
  });

  const addMeasurement = () => {
    setCustomMeasurements([...customMeasurements, { name: "", value: "", unit: "cm" }]);
  };

  const removeMeasurement = (index: number) => {
    const newMeasurements = [...customMeasurements];
    newMeasurements.splice(index, 1);
    setCustomMeasurements(newMeasurements);
  };

  const updateMeasurement = (index: number, field: string, value: string) => {
    const newMeasurements = [...customMeasurements];
    newMeasurements[index] = { ...newMeasurements[index], [field]: value };
    setCustomMeasurements(newMeasurements);
    form.setValue("measurements", newMeasurements);
  };

  const createOrder = async (values: FormValues) => {
    if (!user) {
      toast.error("You must be logged in to create orders");
      return null;
    }

    const order = {
      id: uuidv4(),
      customer_name: values.customerName,
      phone_number: values.phoneNumber || null,
      garment_type: values.garmentType,
      fabric_type: values.fabricType || null,
      fabric_provided_by: values.fabricProvided,
      due_date: values.dueDate,
      delivery_date: values.deliveryDate || null,
      price: parseFloat(values.price),
      advance_paid: values.advancePaid ? parseFloat(values.advancePaid) : 0,
      notes: values.notes || null,
      priority_level: values.priorityLevel,
      status: "pending",
      created_by: user.id,
    };

    const { data, error } = await supabase.from("orders").insert(order).select().single();
    
    if (error) {
      throw error;
    }
    
    // Insert measurements if any
    if (values.measurements && values.measurements.length > 0) {
      const measurementsToInsert = values.measurements.map(m => ({
        order_id: data.id,
        name: m.name,
        value: m.value,
        unit: m.unit
      }));
      
      const { error: measurementError } = await supabase
        .from("measurements")
        .insert(measurementsToInsert);
      
      if (measurementError) {
        throw measurementError;
      }
    }
    
    return data;
  };

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: (data) => {
      toast.success("Order created successfully!");
      navigate(`/orders/${data.id}`);
    },
    onError: (error) => {
      toast.error(`Failed to create order: ${error.message}`);
    },
  });

  const onSubmit = (values: FormValues) => {
    values.measurements = customMeasurements;
    mutation.mutate(values);
  };

  return (
    <Layout title="Create New Order">
      <div className="silai-container">
        <div className="silai-card mb-4">
          <h1 className="text-xl font-semibold mb-6">New Order</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Customer Information */}
                <div className="space-y-4 sm:col-span-2">
                  <h2 className="text-lg font-medium border-b pb-2">Customer Information</h2>
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Customer Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter customer name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Garment Information */}
                <div className="space-y-4 sm:col-span-2">
                  <h2 className="text-lg font-medium border-b pb-2">Garment Information</h2>
                  <FormField
                    control={form.control}
                    name="garmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Garment Type*</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Blouse, Saree, Kurta" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fabricType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fabric Type</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cotton, Silk, Linen" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fabricProvided"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Fabric Provided By</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="customer" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Customer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="tailor" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Tailor (Shop)
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {/* Pricing and Dates */}
                <div className="space-y-4">
                  <h2 className="text-lg font-medium border-b pb-2">Dates & Pricing</h2>
                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="deliveryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expected Delivery Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                              className={cn("p-3 pointer-events-auto")}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Price (₹)*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter price" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="advancePaid"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advance Paid (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter advance amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="priorityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority Level</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="normal" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Normal
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="rush" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Rush
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="urgent" />
                              </FormControl>
                              <FormLabel className="font-normal">
                                Urgent
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Measurements */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium">Measurements</h2>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={addMeasurement}
                    className="flex items-center"
                  >
                    <Plus size={16} className="mr-1" /> Add Measurement
                  </Button>
                </div>
                
                <div className="border rounded-md p-4 bg-gray-50">
                  {customMeasurements.length === 0 ? (
                    <div className="text-center py-4 text-gray-500">
                      <Tape className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                      <p>No measurements added yet.</p>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={addMeasurement}
                        className="mt-2"
                      >
                        <Plus size={16} className="mr-1" /> Add Measurement
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {customMeasurements.map((measurement, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-5">
                            <Input 
                              placeholder="Name (e.g. Chest)" 
                              value={measurement.name}
                              onChange={(e) => updateMeasurement(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="col-span-4">
                            <Input 
                              placeholder="Value" 
                              value={measurement.value}
                              onChange={(e) => updateMeasurement(index, "value", e.target.value)}
                            />
                          </div>
                          <div className="col-span-2">
                            <Input 
                              placeholder="Unit" 
                              value={measurement.unit}
                              onChange={(e) => updateMeasurement(index, "unit", e.target.value)}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeMeasurement(index)}
                            className="col-span-1"
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any special instructions or details for this order"
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Submit buttons */}
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/orders")}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-silai-600 hover:bg-silai-700"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending ? "Saving..." : "Create Order"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Layout>
  );
};

export default NewOrder;
