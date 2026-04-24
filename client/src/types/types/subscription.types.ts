export type PricingPlanType = {
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  description: string;
  highlighted: boolean;
  ctaText: string;
  features: string[];
};

export type PlanDetailsType = {
  name: string;
  planType: "Monthly" | "Yearly";
  price: number;
  tax: number;
  discount: number;
  total: number;
};

export type PlanType = "free" | "pro" | "premium";

export type FeatureType = {
  name: string;
} & Record<PlanType, string | boolean>;

export type CategoryType = {
  name: string;
  features: FeatureType[];
};

export type ComparisonDataType = {
  categories: CategoryType[];
};
