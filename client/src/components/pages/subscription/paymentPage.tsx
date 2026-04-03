"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import OrderSummary from "@/components/subscription/orderSummary";
import PaymentForm from "@/components/subscription/paymentForm";

type PlanDetails = {
  name: string;
  planType: "Monthly" | "Yearly";
  price: number;
  tax: number;
  discount: number;
  total: number;
};

export default function PaymentPage() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const planDetails: PlanDetails = {
    name: "Pro",
    planType: "Yearly",
    price: 144.0,
    tax: 12.96,
    discount: 36.0,
    total: 120.96,
  };

  return (
    <div className="min-h-screen text-text-primary">
      <header className="top-0 z-(--z-dropdown) sticky flex items-center backdrop-blur-md px-4 md:px-8 border-white/10 border-b h-20">
        <Link
          href="/subscription"
          className="group flex items-center gap-2 px-2 py-1 text-text-secondary hover:text-white transition-colors"
        >
          <LuArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="font-medium">Back to Plans</span>
        </Link>
      </header>

      <main className="mx-auto px-4 md:px-8 py-8 md:py-16 max-w-5xl">
        <div className="mb-10 md:text-left text-center">
          <h1 className="mb-2 font-bold text-white text-3xl md:text-4xl">
            Complete your upgrade
          </h1>
          <p className="text-text-secondary">
            Almost there! Complete your payment to unlock Pro features.
          </p>
        </div>

        <div className="flex md:flex-row flex-col items-start gap-8 lg:gap-12">
          {/* Left Column: Order Summary */}
          <div className="md:top-28 z-20 md:sticky order-1 md:order-1 w-full md:w-5/12 lg:w-1/3">
            <OrderSummary planDetails={planDetails} isMobile={isMobile} />
          </div>

          {/* Right Column: Payment Form */}
          <div className="order-2 md:order-2 w-full md:w-7/12 lg:w-2/3">
            <PaymentForm />
          </div>
        </div>
      </main>
    </div>
  );
}
