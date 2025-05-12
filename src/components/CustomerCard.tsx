
import { Link } from "react-router-dom";
import { Phone, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CustomerCardProps {
  id: string;
  name: string;
  mobile: React.ReactNode;
  totalOrders: number;
}

const CustomerCard = ({ id, name, mobile, totalOrders }: CustomerCardProps) => {
  return (
    <Link to={`/customers/${id}`} className="block">
      <Card className="mb-3 hover:shadow-md transition-all hover:-translate-y-1 duration-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-10 w-10 bg-silai-100 rounded-full flex items-center justify-center text-silai-600 mr-3 shadow-sm">
                <User size={18} />
              </div>
              <div>
                <h3 className="font-medium text-gray-800">{name}</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone size={14} className="mr-1" />
                  <a
                    href={`tel:${mobile.replace(/\s+/g, '')}`}
                    className="text-blue-600 hover:underline"
                    onClick={(e) => e.stopPropagation()} // prevents triggering Link
                  >
                    {mobile}
                  </a>
                </div>
              </div>
            </div>
            <Badge className="bg-silai-100 text-silai-700 hover:bg-silai-200 transition-colors" variant="outline">
              {totalOrders} {totalOrders === 1 ? 'order' : 'orders'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default CustomerCard;
