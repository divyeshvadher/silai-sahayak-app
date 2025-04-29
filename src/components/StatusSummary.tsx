
interface StatusSummaryProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StatusSummary = ({ title, count, icon, color }: StatusSummaryProps) => {
  return (
    <div className={`silai-card flex items-center border-l-4 ${color}`}>
      <div className="mr-3">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-bold">{count}</p>
      </div>
    </div>
  );
};

export default StatusSummary;
