"use client";

import { useState } from "react";
import AppSidebar from "@/components/layout/appSidebar";
import BottomNav from "@/components/layout/bottomNav";
import ActionBar from "@/components/discover/actionBar";
import SwipeCard from "@/components/discover/swipeCard";
import Header from "@/components/layout/header";

type Profile = {
  id: number;
  name: string;
  age: number;
  role: string;
  image: string;
  bio: string;
  skills: string[];
  location: string;
  distance: number;
};

type SwipeDirection = "left" | "right" | "super";

const mockProfiles: Profile[] = [
  {
    id: 1,
    name: "Emily Chen",
    age: 28,
    role: "Senior Frontend Engineer",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    bio: "Building beautiful user interfaces. Obsessed with performance and animations. Looking for a promising early-stage startup.",
    skills: ["React", "TypeScript", "Framer Motion"],
    location: "San Francisco, CA",
    distance: 3,
  },
  {
    id: 2,
    name: "Marcus Johnson",
    age: 32,
    role: "Full Stack Developer",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80",
    bio: "Node.js backend wizard trying to get better at React. Currently building an AI SaaS. Open to collaborating on open source.",
    skills: ["Node.js", "PostgreSQL", "AWS"],
    location: "New York, NY",
    distance: 12,
  },
  {
    id: 3,
    name: "Sophia Patel",
    age: 25,
    role: "UI/UX Designer & Dev",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    bio: "Visual thinker translating Figma prototypes into pixel-perfect Tailwind code. Let's build the next big thing.",
    skills: ["Figma", "Tailwind CSS", "Next.js"],
    location: "Austin, TX",
    distance: 8,
  },
];

const DiscoverPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profiles, setProfiles] = useState(mockProfiles);

  const handleSwipe = (direction: SwipeDirection, id?: number) => {
    const targetId =
      id ?? (profiles.length > 0 ? profiles[profiles.length - 1].id : null);

    if (targetId !== null) {
      setProfiles((prev) => prev.filter((p) => p.id !== targetId));
    }
  };

  return (
    <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
      <Header
        type="default"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="hidden xl:flex">
          <AppSidebar />
        </div>

        <div className="relative flex flex-col flex-1 justify-center items-center p-4 pb-20 md:pb-6 overflow-hidden">
          <div className="relative flex justify-center items-center w-full max-w-90 md:max-w-md h-137.5 md:h-150">
            {profiles.length === 0 ? (
              <div className="p-8 border w-full text-center glass">
                <div className="flex justify-center items-center mx-auto mb-4 border border-glass-border-accent rounded-full w-20 h-20 r">
                  <span className="text-3xl">🚀</span>
                </div>
                <h3 className="mb-2 font-bold text-text-primary text-xl">
                  You're all caught up!
                </h3>
                <p className="text-text-secondary text-sm">
                  We're looking for more developers in your area. Check back
                  later or expand your search distance.
                </p>
              </div>
            ) : (
              profiles.map((profile, index) => (
                <SwipeCard
                  key={profile.id}
                  profile={profile}
                  active={index === profiles.length - 1}
                  onSwipe={handleSwipe}
                />
              ))
            )}
          </div>

          {profiles.length > 0 && <ActionBar onSwipe={handleSwipe} />}
        </div>
      </main>

      <BottomNav activeTab="discover" />
    </div>
  );
};

export default DiscoverPage;
