import { Dispatch, SetStateAction } from "react";

export interface SubscriptionPageProps {
  hideHeader: boolean;
}

export interface BillingToggleProps {
  isYearly: boolean;
  setIsYearly: Dispatch<SetStateAction<boolean>>;
}

export interface OrderSummaryProps {
  isMobile: boolean;
}
