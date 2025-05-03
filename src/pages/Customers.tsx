
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
      <div className="silai-container">
        {/* Search and Add buttons */}
        <div className="flex space-x-2 mb-4">
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
          <Link to="/customers/new">
            <Button className="bg-silai-600 hover:bg-silai-700">
              <Plus size={18} className="mr-1" />
              New
            </Button>
          </Link>
        </div>
        
        {/* Customers list */}
        {loading ? (
          <div className="silai-card py-8 text-center">
            <p className="text-gray-500">Loading customers...</p>
          </div>
        ) : filteredCustomers.length > 0 ? (
          filteredCustomers.map(customer => (
            <CustomerCard
              key={customer.id}
              id={customer.id}
              name={customer.name}
              mobile={customer.mobile}
              totalOrders={customer.totalOrders}
            />
          ))
        ) : (
          <div className="silai-card text-center py-6">
            <p className="text-gray-500">No customers found</p>
            <Link to="/customers/new" className="text-silai-600 font-medium mt-2 inline-block">
              Add a customer
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Customers;
