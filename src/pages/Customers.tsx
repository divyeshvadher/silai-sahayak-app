
import { useState } from "react";
import Layout from "../components/Layout";
import CustomerCard from "../components/CustomerCard";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Placeholder data
const mockCustomers = [
  {
    id: "1",
    name: "Priya Sharma",
    mobile: "9876543210",
    totalOrders: 5
  },
  {
    id: "2",
    name: "Amit Patel",
    mobile: "8765432109",
    totalOrders: 2
  },
  {
    id: "3",
    name: "Meera Khanna",
    mobile: "7654321098",
    totalOrders: 7
  },
  {
    id: "4",
    name: "Raj Malhotra",
    mobile: "6543210987",
    totalOrders: 1
  }
];

const Customers = () => {
  const [customers] = useState(mockCustomers);
  const [searchQuery, setSearchQuery] = useState("");
  
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
        {filteredCustomers.length > 0 ? (
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
