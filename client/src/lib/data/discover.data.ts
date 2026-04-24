import { ProfileType } from "@/types/types/discover.types";

export const mockProfiles: ProfileType[] = [
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
