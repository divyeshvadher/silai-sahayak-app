
import { Card, CardContent } from "@/components/ui/card";

interface StatusSummaryProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StatusSummary = ({ title, count, icon, color }: StatusSummaryProps) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-md ${color}`}>
      <CardContent className="p-0">
        <div className="p-4">
          <div className="flex items-center mb-2">
            <div className={`mr-2 p-2 rounded-full bg-opacity-10 ${color.replace('border-', 'bg-')}`}>
              {icon}
            </div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
          </div>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatusSummary;
