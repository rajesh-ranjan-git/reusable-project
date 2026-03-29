import Link from "next/link";
import { LuArrowRight, LuCheck } from "react-icons/lu";

type PricingPlan = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  highlighted: boolean;
  ctaText: string;
  features: string[];
};

export default function PricingCard({
  plan,
  isYearly,
}: {
  plan: PricingPlan;
  isYearly: boolean;
}) {
  const {
    name,
    monthlyPrice,
    yearlyPrice,
    description,
    features,
    highlighted,
    ctaText,
  } = plan;
  const price = isYearly ? yearlyPrice : monthlyPrice;

  return (
    <div
      className={`relative flex flex-col bg-white/80 dark:bg-surface/50 backdrop-blur-md rounded-2xl p-8 transition-all duration-300 
      ${
        highlighted
          ? "border-2 border-primary shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:shadow-[0_0_40px_rgba(79,70,229,0.5)] lg:py-12"
          : "border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20 hover:-translate-y-2 max-h-max"
      }`}
    >
      {highlighted && (
        <div className="-top-3 left-1/2 absolute bg-linear-to-r from-primary to-accent shadow-lg px-4 py-1 rounded-full font-bold text-white text-xs uppercase tracking-wider -translate-x-1/2">
          Most Popular
        </div>
      )}

      <div className="z-10 mb-6">
        <h3 className="mb-2 font-bold text-text-primary text-xl">{name}</h3>
        <p className="h-10 text-text-secondary text-sm">{description}</p>
      </div>

      <div className="z-10 flex items-end gap-1 mb-8">
        <span className="font-extrabold text-text-primary text-4xl">
          ${price}
        </span>
        <span className="pb-1 font-medium text-text-secondary">/mo</span>
      </div>

      <div className="z-10 flex-1 mb-8">
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex justify-center items-center bg-primary/20 mt-0.5 rounded-full w-5 h-5 shrink-0">
                <LuCheck size={12} className="text-primary" />
              </div>
              <span className="text-text-primary text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/payment"
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all z-10 ${
          highlighted
            ? "bg-primary hover:bg-indigo-600 active:bg-indigo-700 text-white shadow-lg"
            : "bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/10 text-text-primary"
        }`}
      >
        {ctaText}
        <LuArrowRight size={16} />
      </Link>
    </div>
  );
}
