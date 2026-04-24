"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import OrderSummary from "@/components/subscription/order.summary";
import PaymentForm from "@/components/forms/subscription/payment.form";

const PaymentPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen text-text-primary">
      <header className="top-0 z-(--z-sticky) sticky flex items-center backdrop-blur-sm w-full glass-nav px-4 md:px-8 h-16">
        <button
          onClick={() => router.push("/subscription")}
          className="group flex items-center gap-2 px-2 py-1 text-text-secondary transition-colors hover:text-accent-purple-dark"
        >
          <LuArrowLeft
            size={20}
            className="transition-transform group-hover:-translate-x-1"
          />
          <span className="font-medium">Back to Plans</span>
        </button>
      </header>

      <main className="mx-auto px-4 md:px-8 py-8 md:py-16 max-w-7xl">
        <div className="mb-10 md:text-left text-center">
          <h1 className="mb-2 font-bold text-text-primary text-3xl md:text-4xl">
            Complete your upgrade
          </h1>
          <p className="text-text-secondary">
            Almost there! Complete your payment to unlock Pro features.
          </p>
        </div>

        <div className="flex md:flex-row flex-col items-start gap-8 lg:gap-12">
          <div className="md:top-28 z-20 md:sticky order-1 md:order-1 w-full md:w-5/12 lg:w-1/3">
            <OrderSummary isMobile={isMobile} />
          </div>

          <div className="order-2 md:order-2 w-full md:w-7/12 lg:w-2/3">
            <PaymentForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default PaymentPage;
