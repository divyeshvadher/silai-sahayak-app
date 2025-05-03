
import { Link } from "react-router-dom";
import { ArrowLeft, User, Phone, Clock } from "lucide-react";

type OrderHeaderProps = {
  order: {
    customer_name: string;
    phone_number: string | null;
    garment_type: string;
    due_date: string;
    delivery_date: string | null;
    status: "pending" | "in-progress" | "completed" | "delivered";
  };
  formatDate: (dateString: string | null) => string;
};

const statusStyles = {
  pending: "bg-amber-50 text-amber-700",
  "in-progress": "bg-blue-50 text-blue-700",
  completed: "bg-jade-50 text-jade-600",
  delivered: "bg-gray-50 text-gray-600",
};

export const OrderHeader = ({ order, formatDate }: OrderHeaderProps) => {
  return (
    <div className="silai-card">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">{order.garment_type}</h2>
          <div className="flex items-center mt-1">
            <User size={16} className="text-gray-500 mr-1" />
            <span className="text-gray-700">{order.customer_name}</span>
          </div>
          {order.phone_number && (
            <div className="flex items-center mt-1">
              <Phone size={16} className="text-gray-500 mr-1" />
              <span className="text-gray-600">{order.phone_number}</span>
            </div>
          )}
        </div>
        <div className={`px-3 py-1.5 rounded-full text-sm ${statusStyles[order.status]}`}>
          {order.status.replace('-', ' ')}
        </div>
      </div>
      
      <div className="border-t border-gray-100 pt-4 mt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Due Date</p>
            <p className="font-medium flex items-center">
              <Clock size={15} className="mr-1 text-amber-500" />
              {formatDate(order.due_date)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Delivery Date</p>
            <p className="font-medium">{formatDate(order.delivery_date)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
