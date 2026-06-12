import { StatCardProps } from "@/types/props/admin.props.types";

const StatCard = ({
  title,
  value,
  change,
  trend = "up",
  icon: Icon,
}: StatCardProps) => {
  return (
    <div className="p-6 transition-all hover:-translate-y-1 glass">
      <div className="flex justify-between items-start mb-4">
        <div className="flex justify-center items-center w-10 h-10 glass">
          <Icon className="w-5 h-5 text-text-primary" />
        </div>
        <span
          className={`alert px-2 py-1 text-xs rounded-full ${trend === "up" ? "alert-success" : "alert-error"}`}
        >
          {trend === "up" ? "+" : "-"}
          {Math.abs(change)}%
        </span>
      </div>
      <div>
        <h6 className="mb-1">{title}</h6>
        <p className="font-bold text-text-primary text-2xl lg:text-3xl tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
