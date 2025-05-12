import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { CustomerMeasurement } from "@/types/dashboard";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Measurements = () => {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<CustomerMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedMeasurement, setSelectedMeasurement] = useState<CustomerMeasurement | null>(null);
  const [editedValues, setEditedValues] = useState({
    chest: 0,
    waist: 0,
    hips: 0,
    shoulder: 0,
    sleeve_length: 0,
    inseam: 0
  });

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("measurements")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;
        
        // Group measurements by customer
        const customerMeasurementsMap = new Map();
        
        data?.forEach(item => {
          if (!customerMeasurementsMap.has(item.name)) {
            customerMeasurementsMap.set(item.name, {
              id: item.id,
              customer_id: item.order_id || "",
              customer_name: item.name || "",
              chest: 0,
              waist: 0,
              hips: 0,
              shoulder: 0,
              sleeve_length: 0,
              inseam: 0,
              updated_at: new Date().toISOString()
            });
          }
          
          const customerData = customerMeasurementsMap.get(item.name);
          if (item.name.includes('chest')) {
            customerData.chest = Number(item.value) || 0;
          } else if (item.name.includes('waist')) {
            customerData.waist = Number(item.value) || 0;
          } else if (item.name.includes('hips')) {
            customerData.hips = Number(item.value) || 0;
          } else if (item.name.includes('shoulder')) {
            customerData.shoulder = Number(item.value) || 0;
          } else if (item.name.includes('sleeve')) {
            customerData.sleeve_length = Number(item.value) || 0;
          } else if (item.name.includes('inseam')) {
            customerData.inseam = Number(item.value) || 0;
          }
        });
        
        setMeasurements(Array.from(customerMeasurementsMap.values()));
      } catch (error: any) {
        toast.error(`Error loading measurements: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();

    // Real-time subscription
    const channel = supabase
      .channel("public:measurements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "measurements" },
        () => {
          fetchMeasurements();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleEdit = (measurement: CustomerMeasurement) => {
    setSelectedMeasurement(measurement);
    setEditedValues({
      chest: measurement.chest,
      waist: measurement.waist,
      hips: measurement.hips,
      shoulder: measurement.shoulder,
      sleeve_length: measurement.sleeve_length,
      inseam: measurement.inseam
    });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedMeasurement) return;

    try {
      const updates = Object.entries(editedValues).map(([key, value]) => ({
        order_id: selectedMeasurement.customer_id,
        name: `${selectedMeasurement.customer_name}_${key}`,
        value: value.toString(),
        unit: 'cm'
      }));

      const { error } = await supabase
        .from("measurements")
        .upsert(updates);

      if (error) throw error;

      toast.success("Measurements updated successfully");
      setEditDialogOpen(false);
    } catch (error: any) {
      toast.error(`Failed to update measurements: ${error.message}`);
    }
  };

  const filteredMeasurements = measurements.filter(
    (measurement) =>
      measurement.customer_name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Layout>
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Customer Measurements
          </h1>
          <Button
            onClick={() => navigate("/measurements/new")}
            className="bg-gray-900 hover:bg-gray-800"
          >
            <Plus size={18} className="mr-1" />
            Add New
          </Button>
        </div>

        <div className="flex space-x-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search customers..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading measurements...</p>
            </div>
          ) : filteredMeasurements.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Chest (cm)</TableHead>
                    <TableHead>Waist (cm)</TableHead>
                    <TableHead>Hips (cm)</TableHead>
                    <TableHead>Shoulder (cm)</TableHead>
                    <TableHead>Sleeve Length (cm)</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeasurements.map((measurement) => (
                    <TableRow key={measurement.id}>
                      <TableCell className="font-medium">
                        {measurement.customer_name}
                      </TableCell>
                      <TableCell>{measurement.chest}</TableCell>
                      <TableCell>{measurement.waist}</TableCell>
                      <TableCell>{measurement.hips}</TableCell>
                      <TableCell>{measurement.shoulder}</TableCell>
                      <TableCell>{measurement.sleeve_length}</TableCell>
                      <TableCell>
                        {formatDate(measurement.updated_at)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(measurement)}
                        >
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No measurements found</p>
              <Button
                onClick={() => navigate("/measurements/new")}
                className="bg-gray-900 hover:bg-gray-800"
              >
                Add New Measurement
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Edit Measurements Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Measurements</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Chest (cm)</Label>
                <Input
                  type="number"
                  value={editedValues.chest}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, chest: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Waist (cm)</Label>
                <Input
                  type="number"
                  value={editedValues.waist}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, waist: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Hips (cm)</Label>
                <Input
                  type="number"
                  value={editedValues.hips}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, hips: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Shoulder (cm)</Label>
                <Input
                  type="number"
                  value={editedValues.shoulder}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, shoulder: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Sleeve Length (cm)</Label>
                <Input
                  type="number"
                  value={editedValues.sleeve_length}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, sleeve_length: Number(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Inseam (cm)</Label>
                <Input
                  type="number"
                  value={editedValues.inseam}
                  onChange={(e) => setEditedValues(prev => ({ ...prev, inseam: Number(e.target.value) }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Measurements;