"use client";

import { useState, useRef, useEffect } from "react";
import { features } from "@/lib/data/landing.data";

const FeaturesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (scrollRef.current && window.innerWidth < 1024) {
      const container = scrollRef.current;
      setTimeout(() => {
        container.scrollTo({ left: 0, behavior: "instant" });
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
      const childEl = child as HTMLElement;

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
    <section id="features" className="relative pt-30">
      <div className="mx-auto px-6 md:px-8 max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6">Built for engineers, by engineers.</h2>
          <p>
            App Name isn't just a networking site. It's a full suite of tools
            designed to help you find the right people to build the right
            products.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="[&::-webkit-scrollbar]:hidden flex items-stretch gap-6 lg:grid lg:grid-cols-3 -mx-6 md:-mx-8 lg:mx-auto px-6 md:px-8 pt-4 pb-8 [-ms-overflow-style:none] overflow-x-auto scroll-smooth snap-mandatory snap-x [scrollbar-width:none]"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group flex-none lg:last:mr-0 last:mr-auto lg:first:ml-0 first:ml-auto p-8 w-[85vw] sm:w-[85] lg:w-auto h-auto transition-all hover:-translate-y-2 duration-300 snap-center glass"
              >
                <div className="flex justify-center items-center mb-6 group-hover:border group-hover:border-glass-border-accent rounded-xl w-12 h-12 group-hover:scale-110 transition-transform group-hover:bg-(image:--gradient-brand-soft)">
                  <Icon className="w-6 h-6" />
                </div>

                <h4 className="mb-2 font-poppins">{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            );
          })}
        </div>

        <div className="lg:hidden flex justify-center gap-2 mt-4">
          {features.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? "w-6 bg-accent-purple-dark" : "w-2 bg-accent-purple/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
