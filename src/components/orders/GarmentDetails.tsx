
import { Scissors } from "lucide-react";

type GarmentDetailsProps = {
  order: {
    fabric_type: string | null;
    fabric_provided_by: string;
    priority_level: string;
    created_at: string;
  };
};

export const GarmentDetails = ({ order }: GarmentDetailsProps) => {
  return (
    <div className="silai-card">
      <h3 className="font-medium text-gray-700 mb-3 flex items-center">
        <Scissors size={16} className="mr-1" />
        Garment Details
      </h3>
      
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div>
          <p className="text-sm text-gray-500">Fabric Type</p>
          <p className="font-medium">{order.fabric_type || "Not specified"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fabric Provided By</p>
          <p className="font-medium capitalize">{order.fabric_provided_by}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Priority Level</p>
          <p className="font-medium capitalize">{order.priority_level}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Created On</p>
          <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};
