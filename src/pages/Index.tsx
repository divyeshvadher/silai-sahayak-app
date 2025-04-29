
import { useState } from "react";
import Layout from "../components/Layout";
import StatusSummary from "../components/StatusSummary";
import OrderCard from "../components/OrderCard";
import { Calendar, Clock, Check, FileText, ArrowRight } from "lucide-react";
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
    status: "pending" as const,
  }
];

const Index = () => {
  const [todaysOrders] = useState(mockOrders);
  
  const orderStats = {
    total: 12,
    pending: 5,
    inProgress: 4,
    completed: 3
  };

  return (
    <Layout>
      <div className="silai-container">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">Welcome back!</h1>
          <p className="text-gray-600">Tuesday, 29 April 2025</p>
        </div>

        {/* Status summaries */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <StatusSummary 
            title="Today's Orders" 
            count={3} 
            icon={<Calendar size={20} className="text-silai-600" />} 
            color="border-silai-600"
          />
          <StatusSummary 
            title="Pending" 
            count={orderStats.pending} 
            icon={<Clock size={20} className="text-amber-500" />} 
            color="border-amber-500"
          />
          <StatusSummary 
            title="In Progress" 
            count={orderStats.inProgress} 
            icon={<FileText size={20} className="text-blue-500" />} 
            color="border-blue-500"
          />
          <StatusSummary 
            title="Completed" 
            count={orderStats.completed} 
            icon={<Check size={20} className="text-jade-500" />} 
            color="border-jade-500"
          />
        </div>
        
        {/* Today's Orders */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Today's Orders</h2>
          <Link to="/orders" className="text-silai-600 text-sm flex items-center">
            View All <ArrowRight size={16} className="ml-1" />
          </Link>
        </div>
        
        {todaysOrders.length > 0 ? (
          todaysOrders.map(order => (
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
            <p className="text-gray-500">No orders for today</p>
            <Link to="/orders/new" className="text-silai-600 font-medium mt-2 inline-block">
              Add new order
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
