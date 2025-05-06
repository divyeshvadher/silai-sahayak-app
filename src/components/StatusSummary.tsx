
import { Card, CardContent } from "@/components/ui/card";

interface StatusSummaryProps {
  title: string;
  count: number | string;
  icon: React.ReactNode;
  color: string;
  bgClass?: string;
  trend?: {
    percentage: number;
    isPositive: boolean;
  };
}

const StatusSummary = ({ title, count, icon, color, bgClass = "from-gray-700/40 to-gray-900/40", trend }: StatusSummaryProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg border-l-4 ${color} animate-fade-in card-glass bg-gradient-to-br ${bgClass}`}>
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex items-center mb-3">
            <div className={`mr-3 p-2.5 rounded-full bg-opacity-15 ${color.replace('border-', 'bg-')}`}>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-300">{title}</p>
          </div>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-white">{count}</p>
            {trend && (
              <div className={`text-xs font-medium flex items-center ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'} px-2 py-1 rounded-full ${trend.isPositive ? 'bg-emerald-900/30' : 'bg-rose-900/30'}`}>
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
