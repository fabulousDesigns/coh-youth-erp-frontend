import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: any;
  description?: string;
  trend?: string;
  trendType?: "positive" | "negative" | "neutral";
  className?: string;
  onClick?: () => void;
  actions?: any;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendType = "neutral",
  className,
  onClick,
}: StatCardProps) {
  const trendColors = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-primary-600 bg-primary-50",
  };

  return (
    <div
      className={cn(
        "relative p-6 bg-white rounded-xl border border-secondary-200",
        "transition-all duration-200 ease-in-out",
        "hover:shadow-md hover:border-secondary-300",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      <div className="flex flex-col space-y-4">
        {/* Header with Icon */}
        <div className="flex items-center justify-between">
          <div className="p-3 bg-secondary-50 rounded-xl">
            <Icon className="w-6 h-6 text-primary-600" />
          </div>
          {trend && (
            <div
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1",
                trendColors[trendType]
              )}
            >
              {trendType === "positive" && <TrendingUp className="w-4 h-4" />}
              {trendType === "negative" && <TrendingDown className="w-4 h-4" />}
              {trend}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-primary-900">{value}</h3>
            <p className="text-sm font-medium text-secondary-600">{title}</p>
          </div>

          {description && (
            <p className="text-sm text-secondary-500">{description}</p>
          )}
        </div>

        {/* Bottom Gradient Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary-500 to-primary-600 opacity-75 rounded-b-xl" />
      </div>
    </div>
  );
}
