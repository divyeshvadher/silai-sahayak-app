
import { Link } from "react-router-dom";
import { User } from "lucide-react";

interface CustomerCardProps {
  id: string;
  name: string;
  mobile: string;
  totalOrders: number;
}

const CustomerCard = ({ id, name, mobile, totalOrders }: CustomerCardProps) => {
  return (
    <Link to={`/customers/${id}`}>
      <div className="silai-card mb-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-silai-100 rounded-full flex items-center justify-center text-silai-600 mr-3">
            <User size={18} />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">{name}</h3>
            <p className="text-sm text-gray-500">{mobile}</p>
          </div>
        </div>
        <div className="bg-silai-50 text-silai-600 px-2 py-1 rounded text-xs">
          {totalOrders} order{totalOrders !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  );
};

export default CustomerCard;
