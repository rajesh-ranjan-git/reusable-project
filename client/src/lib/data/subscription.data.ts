import {
  PricingPlanType,
  PlanDetailsType,
  ComparisonDataType,
} from "@/types/types/subscription.types";

export const pricingPlans: PricingPlanType[] = [
  {
    name: "Free",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description:
      "Perfect for exploring the network and finding open-source projects.",
    highlighted: false,
    ctaText: "Current Plan",
    features: [
      "Basic profile visibility",
      "50 swipes per day",
      "Match & chat",
      "Community forums access",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 15,
    yearlyPrice: 12,
    description:
      "For active developers looking to network and collaborate seriously.",
    highlighted: true,
    ctaText: "Upgrade to Pro",
    features: [
      "Boosted profile visibility",
      "Unlimited swipes",
      "See who liked you",
      "5 Direct Messages per month",
      "Advanced skill filters",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 29,
    yearlyPrice: 24,
    description:
      "Maximum visibility for building squads or finding co-founders.",
    highlighted: false,
    ctaText: "Go Premium",
    features: [
      "Maximum profile visibility",
      "20 Direct Messages per month",
      "Read receipts in chat",
      "Priority 24/7 support",
    ],
  },
];

export const planDetails: PlanDetailsType = {
  name: "Pro",
  planType: "Yearly",
  price: 144.0,
  tax: 12.96,
  discount: 36.0,
  total: 120.96,
};

export const comparisonData: ComparisonDataType = {
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
