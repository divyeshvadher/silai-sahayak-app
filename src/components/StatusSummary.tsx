
import { Card, CardContent } from "@/components/ui/card";

interface StatusSummaryProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  color: string;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
}

const StatusSummary = ({ title, count, icon, color, trend }: StatusSummaryProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md border-l-4 ${color} animate-fade-in`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className={`mr-3 p-2.5 rounded-full bg-opacity-15 ${color.replace('border-', 'bg-')}`}>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold">{count}</p>
            {trend && (
              <div className={`text-xs font-medium flex items-center ${trend.isPositive ? 'text-jade-600' : 'text-red-500'}`}>
                <span className="mr-1">
                  {trend.isPositive ? '↑' : '↓'}
                </span>
                <span>{trend.percentage}%</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSummary;
