import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export const StatCard = ({ title, value, icon, trend, className }: StatCardProps) => {
  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary rounded-lg">
            {icon}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
          </div>
        </div>
        {trend && (
          <div className={cn(
            "text-sm font-medium",
            trend.isPositive ? "text-success" : "text-error"
          )}>
            {trend.isPositive ? "+" : "-"}{trend.value}%
          </div>
        )}
      </div>
    </div>
  );
};