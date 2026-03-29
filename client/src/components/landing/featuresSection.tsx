"use client";

import { useState, useRef, useEffect } from "react";
import {
  LuTerminal,
  LuUsers,
  LuZap,
  LuSearch,
  LuMessageSquare,
  LuShieldCheck,
} from "react-icons/lu";

const features = [
  {
    icon: LuSearch,
    title: "Smart Matching Algorithm",
    description:
      "Find optimal collaborators based on tech stack, experience level, and project interests using our proprietary matching engine.",
  },
  {
    icon: LuTerminal,
    title: "Code-First Profiles",
    description:
      "Showcase your real skills by integrating directly with GitHub and GitLab. Let your commits do the talking.",
  },
  {
    icon: LuMessageSquare,
    title: "Developer-Optimized Chat",
    description:
      "Built-in code snippet sharing, syntax highlighting, and seamless real-time communication tools.",
  },
  {
    icon: LuUsers,
    title: "Project Squads",
    description:
      "Create mini-teams dynamically. Match with specialized developers to fill skill gaps in your ongoing projects.",
  },
  {
    icon: LuZap,
    title: "Instant Collaboration",
    description:
      "Launch cloud environments instantly when matched to start pair programming without friction.",
  },
  {
    icon: LuShieldCheck,
    title: "Verified Badges",
    description:
      "Earn credibility through peer reviews, verified work history, and hackathon achievements.",
  },
];

export default function FeaturesSection() {
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
    <section id="features" className="relative py-24">
      <div className="mx-auto px-6 md:px-8 max-w-7xl">
        <div className="mx-auto mb-16 max-w-3xl text-center">
          <h2 className="mb-6 font-bold text-white text-3xl md:text-5xl tracking-tight">
            Built for engineers, by engineers.
          </h2>
          <p className="text-text-secondary text-lg">
            Your App Name isn't just a networking site. It's a full suite of
            tools designed to help you find the right people to build the right
            products.
          </p>
        </div>

        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="[&::-webkit-scrollbar]:hidden flex items-stretch gap-6 lg:grid lg:grid-cols-3 -mx-6 md:-mx-8 lg:mx-auto px-6 md:px-8 lg:px-0 pt-4 pb-8 [-ms-overflow-style:none] overflow-x-auto scroll-smooth snap-mandatory snap-x [scrollbar-width:none]"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group flex-none bg-surface/50 hover:bg-white/10 backdrop-blur-md lg:last:mr-0 last:mr-auto lg:first:ml-0 first:ml-auto p-8 border border-white/5 hover:border-white/20 rounded-2xl w-[85vw] sm:w-[85] lg:w-auto h-auto transition-all hover:-translate-y-2 duration-300 snap-center"
              >
                <div className="flex justify-center items-center bg-primary/80 group-hover:bg-primary mb-6 group-hover:border rounded-xl w-12 h-12 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-text-primary" />
                </div>
                <h3 className="mb-3 font-bold text-white text-xl">
                  {feature.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        <div className="lg:hidden flex justify-center gap-2 mt-4">
          {features.map((_, idx) => (
            <div
              key={idx}
              className={`h-2 rounded-full transition-all duration-300 ${activeIndex === idx ? "w-6 bg-primary" : "w-2 bg-white/20"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
