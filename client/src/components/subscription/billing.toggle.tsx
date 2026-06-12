import { BillingToggleProps } from "@/types/props/subscription.props.types";

const BillingToggle = ({ isYearly, setIsYearly }: BillingToggleProps) => {
  return (
    <div className="flex justify-center items-center gap-4 mb-12">
      <span
        className={`text-sm font-medium transition-colors ${!isYearly ? "text-text-primary" : "text-text-secondary"}`}
      >
        Monthly
      </span>

      <button
        onClick={() => setIsYearly(!isYearly)}
        className="relative border border-accent-purple-light rounded-full focus:outline-none focus:ring-1 w-14 h-7 transition-colors focus:ring-accent-purple-dark"
      >
        <div
          className={`absolute left-1 w-5 h-5 rounded-full bg-accent-purple-dark transition-transform duration-300 shadow-md ${isYearly ? "translate-x-6.75" : ""}`}
        />
      </button>

      <div className="flex justify-center items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${isYearly ? "text-primary" : "text-text-secondary"}`}
        >
          Yearly
        </span>
        <span className="bg-status-success-bg px-2 py-0.5 border border-status-success-border rounded-full font-bold text-[10px] text-status-success-text">
          Save 20%
        </span>
      </div>
    </div>
  );
};

export default BillingToggle;
