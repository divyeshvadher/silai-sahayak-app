
import { Link } from "react-router-dom";
import { Clock } from "lucide-react";

interface OrderCardProps {
  id: string;
  customerName: string;
  garmentType: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed" | "delivered";
}

const OrderCard = ({ 
  id, 
  customerName, 
  garmentType, 
  dueDate, 
  status 
}: OrderCardProps) => {
  // Status styling
  const statusStyles = {
    pending: "bg-amber-50 text-amber-700",
    "in-progress": "bg-blue-50 text-blue-700",
    completed: "bg-jade-50 text-jade-600",
    delivered: "bg-gray-50 text-gray-600",
  };
  
  // Format due date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Link to={`/orders/${id}`}>
      <div className="silai-card mb-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-medium text-gray-800">
            {garmentType}
          </h3>
          <div className={`px-2 py-1 rounded-full text-xs ${statusStyles[status]}`}>
            {status.replace('-', ' ')}
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-2">
          {customerName}
        </p>
        <div className="flex items-center text-xs text-gray-500">
          <Clock size={14} className="mr-1" />
          Due: {formatDate(dueDate)}
        </div>
      </div>
    </Link>
  );
};

export default OrderCard;
