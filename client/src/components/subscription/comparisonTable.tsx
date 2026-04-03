import { LuCheck, LuMinus } from "react-icons/lu";

type Plan = "free" | "pro" | "premium";

type Feature = {
  name: string;
} & Record<Plan, string | boolean>;

type Category = {
  name: string;
  features: Feature[];
};

type ComparisonData = {
  categories: Category[];
};

const comparisonData: ComparisonData = {
  categories: [
    {
      name: "Core Features",
      features: [
        {
          name: "Profile Visibility",
          free: "Standard",
          pro: "Boosted",
          premium: "Maximum",
        },
        {
          name: "Daily Match Limits",
          free: "50 Swipes",
          pro: "Unlimited",
          premium: "Unlimited",
        },
        {
          name: "Direct Messages",
          free: "Matches Only",
          pro: "Matches + 5 Direct/mo",
          premium: "Matches + 20 Direct/mo",
        },
      ],
    },
    {
      name: "Advanced Tools",
      features: [
        { name: "See Who Liked You", free: false, pro: true, premium: true },
        {
          name: "Advanced Filters",
          free: false,
          pro: "Basic",
          premium: "All Filters",
        },
        { name: "Incognito Mode", free: false, pro: false, premium: true },
        { name: "Read Receipts", free: false, pro: true, premium: true },
        { name: "Priority Support", free: false, pro: false, premium: true },
      ],
    },
  ],
};

export default function ComparisonTable() {
  return (
    <div className="hidden md:block mx-auto mt-30 max-w-250 overflow-x-auto custom-scrollbar">
      <div className="mb-12 text-center">
        <h2 className="mb-4">Compare all features</h2>
        <p>Everything you need to know to make the right choice.</p>
      </div>

      <div className="w-full min-w-175">
        <div className="top-0 z-(--z-raised) sticky gap-4 grid grid-cols-4 bg-glass-bg hover:bg-glass-bg-hover backdrop-blur-md p-4 rounded-t-md text-lg">
          <div className="col-span-1"></div>
          <div className="font-bold text-text-secondary text-center">Free</div>
          <div className="font-bold text-center">Pro</div>
          <div className="font-bold text-center text-accent-purple">
            Premium
          </div>
        </div>

        <div className="flex flex-col">
          {comparisonData.categories.map((category, idx) => (
            <div key={idx} className="w-full">
              <div className="bg-glass-bg-strong px-4 py-3 font-bold text-sm uppercase tracking-widest">
                {category.name}
              </div>

              {category.features.map((feature, fIdx) => (
                <div
                  key={fIdx}
                  className="items-center gap-4 grid grid-cols-4 hover:bg-glass-bg p-4 border-glass-border border-b text-sm transition-colors"
                >
                  <div className="col-span-1 px-2 font-medium text-text-primary">
                    {feature.name}
                  </div>

                  {(["free", "pro", "premium"] as Plan[]).map((tier) => {
                    const value = feature[tier];

                    if (typeof value === "boolean") {
                      return (
                        <div key={tier} className="flex justify-center">
                          {value ? (
                            <div className="flex justify-center items-center rounded-full w-6 h-6">
                              <LuCheck size={14} className="text-primary" />
                            </div>
                          ) : (
                            <LuMinus
                              size={16}
                              className="text-text-secondary/50"
                            />
                          )}
                        </div>
                      );
                    }
                    return (
                      <div
                        key={tier}
                        className="text-text-secondary text-center"
                      >
                        {value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
