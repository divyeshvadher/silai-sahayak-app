
import { Link } from "react-router-dom";
import { Clock, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    pending: "bg-amber-100 text-amber-800 hover:bg-amber-200",
    "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-200",
    completed: "bg-jade-100 text-jade-800 hover:bg-jade-200",
    delivered: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  };
  
  const statusLabels = {
    pending: "Pending",
    "in-progress": "In Progress",
    completed: "Completed",
    delivered: "Delivered"
  };
  
  // Format due date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric',
      month: 'short'
    });
  };

  const isToday = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    return today.toDateString() === dueDate.toDateString();
  };

  const isPastDue = (dateString: string) => {
    const today = new Date();
    const dueDate = new Date(dateString);
    return dueDate < today && status !== "completed" && status !== "delivered";
  };

  return (
    <Link to={`/orders/${id}`}>
      <Card className="transition-all hover:shadow-md border-l-4 hover:-translate-y-1 duration-200" 
        style={{ 
          borderLeftColor: 
            isPastDue(dueDate) ? '#f43f5e' : 
            isToday(dueDate) ? '#3b82f6' : '#e2e8f0' 
        }}>
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-gray-800">
              {garmentType}
            </h3>
            <Badge className={`${statusStyles[status]} transition-colors`} variant="outline">
              {statusLabels[status]}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <User size={14} className="mr-1" />
            <span>{customerName}</span>
          </div>
          <div className="flex items-center text-xs text-gray-500">
            <Clock size={14} className="mr-1" />
            <span className={isPastDue(dueDate) ? "text-red-500 font-medium" : ""}>
              Due: {formatDate(dueDate)}
              {isPastDue(dueDate) && " (overdue)"}
              {isToday(dueDate) && " (today)"}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default OrderCard;
