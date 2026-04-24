"use client";

import { useState, useRef, useEffect } from "react";
import { LuQuote } from "react-icons/lu";
import { testimonials } from "@/lib/data/landing.data";

const CommunitySection = () => {
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
    <section id="community" className="relative pt-30">
      <div className="mx-auto px-6 md:px-8 max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6">Loved by the community.</h2>
          <p>
            Join thousands of developers, designers, and founders who are
            already building the future together through App Name.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="[&::-webkit-scrollbar]:hidden flex items-stretch gap-6 lg:grid lg:grid-cols-4 -mx-6 md:-mx-8 lg:mx-auto px-6 md:px-8 pt-4 pb-12 [-ms-overflow-style:none] overflow-x-auto scroll-smooth snap-mandatory snap-x [scrollbar-width:none]"
        >
          {testimonials.map((testimonial, idx) => (
            <div
              key={idx}
              className="group flex flex-col flex-none justify-between lg:last:mr-0 last:mr-auto lg:first:ml-0 first:ml-auto p-8 border w-[85vw] sm:w-85 lg:w-auto h-auto transition-all hover:-translate-y-2 duration-300 snap-center glass-interactive"
            >
              <div>
                <LuQuote className="mb-4 w-8 h-8" />
                <p className="mb-8 text-sm italic leading-relaxed">
                  "{testimonial.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="border border-white/10 rounded-full w-10 h-10 object-cover"
                />
                <div>
                  <h4 className="font-bold text-sm">{testimonial.name}</h4>
                  <p className="font-medium text-primary text-xs">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:hidden flex justify-center gap-2 mt-4">
          {testimonials.map((_, idx) => (
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

export default CommunitySection;
