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

const PricingCard = ({
  plan,
  isYearly,
}: {
  plan: PricingPlan;
  isYearly: boolean;
}) => {
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
      className={`relative group flex flex-col glass p-8 transition-all duration-300 hover:-translate-y-2
      ${highlighted ? "border-2 animate-pulse-glow lg:py-12 hover:bg-(image:--gradient-brand-soft)" : "max-h-max"}`}
    >
      {highlighted && (
        <div className="-top-3 left-1/2 absolute flex items-center gap-1.5 shadow-md hover:shadow-lg px-4 py-1 group-hover:border-accent-purple-light w-max font-bold text-xs uppercase tracking-wider transition-shadow -translate-x-1/2 ease-in-out badge badge-gradient">
          Most Popular
        </div>
      )}

      <div className="z-(--z-raised) mb-6">
        <h3 className="mb-2 font-poppins text-3xl">{name}</h3>
        <p>{description}</p>
      </div>

      <div className="z-(--z-raised) flex items-end gap-1 mb-8">
        <span className="font-extrabold text-4xl">${price}</span>
        <span className="pb-1 font-medium text-text-secondary">/mo</span>
      </div>

      <div className="z-(--z-raised) flex-1 mb-8">
        <ul className="space-y-4">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex justify-center items-center mt-0.5 rounded-full w-5 h-5 shrink-0">
                <LuCheck size={12} className="text-primary" />
              </div>
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href="/subscription/payment"
        className={`w-full btn flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all z-(--z-raised) ${
          highlighted
            ? "btn-primary text-text-on-accent border border-transparent group-hover:border-accent-purple-light"
            : "btn-secondary"
        }`}
      >
        {ctaText}
        <LuArrowRight size={16} />
      </Link>
    </div>
  );
};

export default PricingCard;
