"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";
import { SubscriptionPageProps } from "@/types/props/subscription.props.types";
import { pricingPlans } from "@/lib/data/subscription.data";
import BillingToggle from "@/components/subscription/billing.toggle";
import PricingCard from "@/components/subscription/pricing.card";
import ComparisonTable from "@/components/subscription/comparison.table";

const SubscriptionPage = ({ hideHeader }: SubscriptionPageProps) => {
  const router = useRouter();
  const [isYearly, setIsYearly] = useState(false);
  const [activeIndex, setActiveIndex] = useState(1);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current && window.innerWidth < 1024) {
      const container = scrollRef.current;
      setTimeout(() => {
        const scrollWidth = container.scrollWidth;
        const clientWidth = container.clientWidth;
        container.scrollTo({
          left: (scrollWidth - clientWidth) / 2,
          behavior: "instant",
        });
      }, 50);
    }
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const containerCenter = container.scrollLeft + container.clientWidth / 2;

    let closestIndex = 0;
    let minDistance = Infinity;

    Array.from(container.children).forEach((child, index) => {
      const childEl = child as HTMLDivElement;

      const childCenter = childEl.offsetLeft + childEl.clientWidth / 2;
      const distance = Math.abs(containerCenter - childCenter);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = index;
      }
    });

    if (
      container.scrollLeft + container.clientWidth >=
      container.scrollWidth - 10
    ) {
      closestIndex = container.children.length - 1;
    } else if (container.scrollLeft <= 10) {
      closestIndex = 0;
    }

    setActiveIndex(closestIndex);
  };

  return (
    <section
      id="pricing"
      className={`text-text-primary selection:bg-primary/30 pb-20 ${hideHeader ? "" : "min-h-screen"}`}
    >
      {!hideHeader && (
        <header className="top-0 z-(--z-sticky) sticky flex items-center backdrop-blur-sm w-full glass-nav px-4 md:px-8 h-16">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 px-2 py-1 text-text-secondary transition-colors hover:text-accent-purple-dark"
          >
            <LuArrowLeft
              size={20}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="font-medium">Back to App</span>
          </button>
        </header>
      )}

      <main className="mx-auto px-6 md:px-8 pt-30 max-w-7xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h1 className="mb-4">Invest in your network</h1>
          <p>
            Choose the clear path to better collaborations. Upgrade to unlock
            powerful matching tools and increased visibility.
          </p>
        </div>

        <BillingToggle isYearly={isYearly} setIsYearly={setIsYearly} />

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="[&::-webkit-scrollbar]:hidden flex items-center gap-6 lg:gap-8 lg:grid lg:grid-cols-3 -mx-6 md:-mx-8 lg:mx-auto px-6 md:px-8 py-8 max-w-6xl [-ms-overflow-style:none] overflow-x-auto scroll-smooth snap-mandatory snap-x [scrollbar-width:none]"
        >
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="flex-none lg:last:mr-0 last:mr-auto lg:first:ml-0 first:ml-auto w-[85vw] sm:w-85 lg:w-auto snap-center"
            >
              <PricingCard plan={plan} isYearly={isYearly} />
            </div>
          ))}
        </div>

        <div className="lg:hidden flex justify-center gap-2 mt-4 mb-8">
          {pricingPlans.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? "w-6 bg-accent-purple-dark" : "w-2 bg-accent-purple/20"}`}
            />
          ))}
        </div>

        <ComparisonTable />
      </main>
    </section>
  );
};

export default SubscriptionPage;
