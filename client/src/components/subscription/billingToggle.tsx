import { Dispatch, SetStateAction } from "react";

export default function BillingToggle({
  isYearly,
  setIsYearly,
}: {
  isYearly: boolean;
  setIsYearly: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="flex justify-center items-center gap-4 mb-12">
      <span
        className={`text-sm font-medium transition-colors ${!isYearly ? "text-white" : "text-text-secondary"}`}
      >
        Monthly
      </span>

      <button
        onClick={() => setIsYearly(!isYearly)}
        className="relative bg-surface border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/50 w-14 h-7 transition-colors"
      >
        <div
          className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-primary transition-transform duration-300 shadow-md ${isYearly ? "translate-x-7 bg-accent" : ""}`}
        />
      </button>

      <div className="flex items-center gap-2">
        <span
          className={`text-sm font-medium transition-colors ${isYearly ? "text-white" : "text-text-secondary"}`}
        >
          Yearly
        </span>
        <span className="bg-green-400/10 px-2 py-0.5 border border-green-400/20 rounded-full font-bold text-[10px] text-green-400">
          Save 20%
        </span>
      </div>
    </div>
  );
}
