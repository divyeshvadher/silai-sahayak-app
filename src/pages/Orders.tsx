
import { useState } from "react";
import Layout from "../components/Layout";
import OrderCard from "../components/OrderCard";
import { Button } from "@/components/ui/button";
import { Search, Plus, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Placeholder data
const mockOrders = [
  {
    id: "1",
    customerName: "Priya Sharma",
    garmentType: "Anarkali Suit",
    dueDate: "2025-05-02",
    status: "in-progress" as const,
  },
  {
    id: "2",
    customerName: "Amit Patel",
    garmentType: "Wedding Sherwani",
    dueDate: "2025-05-10", 
    status: "pending" as const,
  },
  {
    id: "3",
    customerName: "Meera Khanna",
    garmentType: "Blouse",
    dueDate: "2025-04-30",
    status: "completed" as const,
  },
  {
    id: "4",
    customerName: "Raj Malhotra",
    garmentType: "Business Suit",
    dueDate: "2025-05-15",
    status: "pending" as const,
  },
  {
    id: "5",
    customerName: "Ananya Singh",
    garmentType: "Lehenga",
    dueDate: "2025-06-01",
    status: "delivered" as const,
  }
];

const Orders = () => {
  const [orders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredOrders = orders.filter(order => 
    order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.garmentType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout title="Orders">
      <div className="silai-container">
        {/* Search and Add buttons */}
        <div className="flex space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Search orders..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="px-3">
            <Filter size={18} />
          </Button>
          <Link to="/orders/new">
            <Button className="bg-silai-600 hover:bg-silai-700">
              <Plus size={18} className="mr-1" />
              New
            </Button>
          </Link>
        </div>
        
        {/* Orders list */}
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              id={order.id}
              customerName={order.customerName}
              garmentType={order.garmentType}
              dueDate={order.dueDate}
              status={order.status}
            />
          ))
        ) : (
          <div className="silai-card text-center py-6">
            <p className="text-gray-500">No orders found</p>
            <Link to="/orders/new" className="text-silai-600 font-medium mt-2 inline-block">
              Add new order
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Orders;
