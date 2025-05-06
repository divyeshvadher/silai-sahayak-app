
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

type CustomerMeasurement = {
  id: string;
  customer_name: string;
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  updated_at: string;
};

const Measurements = () => {
  const navigate = useNavigate();
  const [measurements, setMeasurements] = useState<CustomerMeasurement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchMeasurements = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("customer_measurements")
          .select("*")
          .order("customer_name", { ascending: true });

        if (error) throw error;
        setMeasurements(data || []);
      } catch (error: any) {
        toast.error(`Error loading measurements: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchMeasurements();

    // Real-time subscription
    const channel = supabase
      .channel("public:customer_measurements")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "customer_measurements" },
        (payload) => {
          fetchMeasurements(); // Refresh data on any change
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

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
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMeasurements.map((measurement) => (
                    <TableRow
                      key={measurement.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/measurements/${measurement.id}`)}
                    >
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
    </Layout>
  );
};

export default Measurements;
