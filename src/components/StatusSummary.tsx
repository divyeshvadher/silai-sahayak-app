
import { Card, CardContent } from "@/components/ui/card";

interface StatusSummaryProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  color?: string;
  bgClass?: string;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
  subtitle?: string;
}

const StatusSummary = ({ 
  title, 
  count, 
  icon, 
  color = "text-gray-600",
  subtitle
}: StatusSummaryProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow border">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center mb-4">
            <div className={`mr-3 p-2 rounded-md ${color}`}>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <div className="flex flex-col">
            <p className="text-2xl font-bold text-gray-800">{count}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSummary;
