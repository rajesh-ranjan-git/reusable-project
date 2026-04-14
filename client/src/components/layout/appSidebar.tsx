"use client";

import { Dispatch, SetStateAction, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { LuMessageCircle, LuSearch, LuUserPlus } from "react-icons/lu";
import { staticImages } from "@/config/common.config";
import { chatRoutes } from "@/lib/routes/routes";

interface AppSidebarProps {
  setIsSidebarOpen?: Dispatch<SetStateAction<boolean>>;
}

type SwipeDirection = "left" | "right" | "super";

type Request = {
  id: number;
  name: string;
  role: string;
  avatar: string;
};

const initialMockRequests: Request[] = [
  {
    id: 1,
    name: "Sarah Connor",
    role: "Backend Engineer",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    id: 2,
    name: "Kyle Reese",
    role: "DevOps Specialist",
    avatar: "https://i.pravatar.cc/150?u=kyle",
  },
  {
    id: 3,
    name: "John Connor",
    role: "Full Stack Lead",
    avatar: "https://i.pravatar.cc/150?u=john",
  },
  {
    id: 4,
    name: "Miles Dyson",
    role: "AI Researcher",
    avatar: "https://i.pravatar.cc/150?u=miles",
  },
];

const AppSidebar = ({ setIsSidebarOpen }: AppSidebarProps) => {
  const router = useRouter();
  const [showAllRequests, setShowAllRequests] = useState(false);
  const [requests, setRequests] = useState(initialMockRequests);
  const [exitDirection, setExitDirection] = useState<
    Record<number, SwipeDirection>
  >({});

  const handleAction = (id: number, direction: SwipeDirection) => {
    setExitDirection((prev) => ({ ...prev, [id]: direction }));
    setTimeout(() => {
      setRequests((prev) => prev.filter((req) => req.id !== id));
    }, 0);
  };

  const visibleRequests = showAllRequests ? requests : requests.slice(0, 2);

  return (
    <aside className="flex flex-col border-glass-border border-r border-b-0 md:w-64 lg:w-72 h-full transition-all duration-500 glass-nav shrink-0">
      <div className="p-2 pt-3 border-glass-border border-b">
        <h2 className="font-arima md:text-3xl tracking-wider">Network</h2>
      </div>
      <div className="md:hidden p-2">
        <div className="relative flex-1 max-w-md">
          <LuSearch className="top-1/2 left-3 absolute w-4 h-4 text-text-secondary -translate-y-1/2 shrink-0 z-(--z-raised)" />
          <input
            type="search"
            className="py-1 pl-9 rounded-full"
            placeholder="Search developers, skills..."
          />
        </div>
      </div>
      <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
        <div className="mb-2">
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wider">
            Requests
          </h6>
          <div className="flex items-center gap-3 mb-3 alert alert-info">
            <LuUserPlus className="text-primary" size={20} />
            <p className="font-medium text-status-info-text text-sm">
              {requests.length} New Requests
            </p>
          </div>

          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {visibleRequests.map((req) => (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: "auto", scale: 1 }}
                  exit={{
                    opacity: 0,
                    x: exitDirection[req.id] === "right" ? 100 : -100,
                    height: 0,
                    marginTop: 0,
                    marginBottom: 0,
                    transition: { duration: 0.25, ease: "backIn" },
                  }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden">
                    <div className="flex items-center gap-2 pr-1 min-w-0">
                      <Image
                        src={req.avatar}
                        alt={req.name}
                        width={100}
                        height={100}
                        className="shadow-glass rounded-full w-10 h-10 object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h6 className="font-medium text-text-primary text-sm truncate">
                          {req.name}
                        </h6>
                        <p className="text-text-secondary text-xs truncate">
                          {req.role}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="p-0 rounded-md alert alert-success">
                        <button
                          onClick={() => handleAction(req.id, "right")}
                          className="p-0 w-8 h-8 font-medium text-status-success-text text-sm"
                        >
                          ✓
                        </button>
                      </div>
                      <div className="p-0 rounded-md alert alert-error">
                        <button
                          onClick={() => handleAction(req.id, "left")}
                          className="p-0 w-8 h-8 font-medium text-status-error-text text-sm"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {!showAllRequests && requests.length > 2 && (
            <button
              onClick={() => setShowAllRequests(true)}
              className="my-2 w-full btn btn-secondary"
            >
              Show all requests ({requests.length})
            </button>
          )}
        </div>

        <div>
          <h6 className="mb-3 font-poppins text-text-secondary uppercase tracking-wider">
            Connections
          </h6>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                onClick={() => router.push(`/profile/${i}`)}
                className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden"
              >
                <div className="flex items-center gap-2 pr-1 min-w-0">
                  <div className="relative shrink-0">
                    <Image
                      src={staticImages.avatarPlaceholder.src}
                      alt={staticImages.avatarPlaceholder.alt}
                      width={100}
                      height={100}
                      className="shadow-glass rounded-full w-10 h-10 object-cover"
                    />
                    <div
                      className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-bg ${i % 2 === 0 ? "bg-green-500" : "bg-gray-500"}`}
                    ></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h6 className="font-medium text-text-primary text-sm truncate">
                      Rajesh Ranjan
                    </h6>
                    <p className="text-text-secondary text-xs truncate">
                      Full Stack Developer
                    </p>
                  </div>
                </div>
                <div className="p-0 rounded-md alert alert-info">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();

                      if (setIsSidebarOpen) {
                        setIsSidebarOpen(false);
                      }

                      router.push(chatRoutes.chat);
                    }}
                    className="p-0 w-8 h-8 font-medium text-status-info-text text-sm"
                  >
                    <LuMessageCircle size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
