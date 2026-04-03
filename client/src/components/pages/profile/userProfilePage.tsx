"use client";

import { useParams } from "next/navigation";
import AppSidebar from "@/components/layout/appSidebar";
import BottomNav from "@/components/layout/bottomNav";
import Header from "@/components/layout/header";
import ActivitySection from "@/components/profile/activitySection";
import ProfileHeader from "@/components/profile/profileHeader";
import TechStack from "@/components/profile/techStack";

type User = {
  name: string;
  headline: string;
  location: string;
  website: string;
  joinedDate: string;
  coverImage: string;
  avatar: string;
  online: boolean;
};

type Skill = {
  name: string;
  level: string;
  icon: string;
};

type Activity = {
  type: string;
  date: string;
  title: string;
  description: string;
};

const mockUser: User = {
  name: "Sarah Connor",
  headline: "Machine Learning Engineer | Python AI Specialist",
  location: "London, UK",
  website: "https://sarahml.dev",
  joinedDate: "January 2024",
  coverImage:
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80",
  avatar: "https://i.pravatar.cc/150?u=sarah",
  online: false,
};

const mockSkills: Skill[] = [
  {
    name: "Python",
    level: "Expert",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  {
    name: "TensorFlow",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  {
    name: "AWS",
    level: "Intermediate",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg",
  },
  {
    name: "Docker",
    level: "Advanced",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
];

const mockActivities: Activity[] = [
  {
    type: "commit",
    date: "3 days ago",
    title: "Pushed to sarahml/neural-net-core",
    description: "Optimized training epoch loop time by 15%.",
  },
  {
    type: "star",
    date: "last week",
    title: "Starred huggingface/transformers",
    description: "",
  },
];

export default function UserProfilePage() {
  const { id } = useParams();

  const isOwnProfile = false;

  return (
    <div className="flex flex-col bg-bg h-dvh overflow-hidden text-text-primary">
      <Header />

      <main className="relative flex flex-1 overflow-hidden">
        <div className="hidden md:flex">
          <AppSidebar />
        </div>

        <div className="flex-1 bg-bg/50 overflow-y-auto custom-scrollbar">
          <div className="mx-auto p-4 md:p-8 pb-24 md:pb-8 max-w-200">
            <ProfileHeader isOwnProfile={isOwnProfile} user={mockUser} />

            <div className="mb-6 p-6 leading-relaxed glass">
              <h3 className="mb-4">About Me</h3>
              I'm a passionate software engineer with 6+ years of experience
              building scalable web applications. I love bridging the gap
              between design and engineering. Currently looking for innovative
              teams building tools for creators or developers. Let's connect!
            </div>

            <TechStack skills={mockSkills} />
            <ActivitySection activities={mockActivities} />
          </div>
        </div>
      </main>

      <BottomNav activeTab="discover" />
    </div>
  );
}
