
import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import CustomerCard from "../components/CustomerCard";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Type definition for customers
type Customer = {
  id: string;
  name: string;
  mobile: string;
  totalOrders: number;
};

const Customers = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch customers data from orders table (grouping by customer_name)
  useEffect(() => {
    const fetchCustomers = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        
        // Get orders grouped by customer_name
        const { data, error } = await supabase
          .from("orders")
          .select("customer_name, phone_number, id");
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Process data to create customer list with order counts
          const customersMap = new Map<string, Customer>();
          
          data.forEach((order) => {
            const name = order.customer_name;
            const mobile = order.phone_number || "";
            
            if (customersMap.has(name)) {
              // Increment order count for existing customer
              const existingCustomer = customersMap.get(name)!;
              existingCustomer.totalOrders += 1;
            } else {
              // Create new customer entry
              customersMap.set(name, {
                id: order.id, // Using first order ID as customer ID (simplified approach)
                name,
                mobile,
                totalOrders: 1
              });
            }
          });
          
          setCustomers(Array.from(customersMap.values()));
        }
      } catch (error: any) {
        toast.error(`Error loading customers: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
    
    // Set up a real-time subscription to orders table
    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        () => {
          // When any order changes, refresh the customer list
          fetchCustomers();
        }
      )
      .subscribe();
    
    // Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.mobile.includes(searchQuery)
  );

  return (
    <Layout title="Customers">
      <div className="silai-container animate-fade-in">
        <Card className="mb-6 border-none shadow-md">
          <CardHeader className="bg-gradient-to-r from-silai-50 to-silai-100 rounded-t-lg pb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-xl font-bold text-silai-800">Customers</CardTitle>
              <div className="flex space-x-2 w-full md:w-auto">
                <div className="relative flex-1 md:min-w-[240px]">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search customers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Link to="/customers/new">
                  <Button className="bg-silai-600 hover:bg-silai-700 shadow-sm transition-all hover:shadow-md whitespace-nowrap">
                    <Plus size={18} className="mr-1" />
                    New
                  </Button>
                </Link>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-4">
            {/* Customers list */}
            {loading ? (
              <div className="py-8 text-center">
                <p className="text-gray-500">Loading customers...</p>
              </div>
            ) : filteredCustomers.length > 0 ? (
              <div className="space-y-3">
                {filteredCustomers.map(customer => (
                  <CustomerCard
                    key={customer.id}
                    id={customer.id}
                    name={customer.name}
                    mobile={customer.mobile}
                    totalOrders={customer.totalOrders}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <p className="text-gray-500 mb-2">No customers found</p>
                <Link to="/customers/new" className="text-silai-600 font-medium hover:text-silai-800 transition-colors inline-block">
                  Add a customer
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Customers;
