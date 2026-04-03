import { motion, useMotionValue, useTransform, PanInfo } from "motion/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LuBriefcase, LuMapPin } from "react-icons/lu";

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

type SwipeCardProps = {
  profile: Profile;
  onSwipe: (direction: SwipeDirection, id?: number) => void;
  active: boolean;
};

export default function SwipeCard({
  profile,
  onSwipe,
  active,
}: SwipeCardProps) {
  const router = useRouter();
  const x = useMotionValue(0);
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    if (info.offset.x > 100) {
      onSwipe("right", profile.id);
    } else if (info.offset.x < -100) {
      onSwipe("left", profile.id);
    }
  };

  return (
    <motion.div
      className={`absolute w-full glass-heavy h-full overflow-hidden  ${!active ? "pointer-events-none" : ""}`}
      style={{ x, opacity, rotate }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={active ? { cursor: "grabbing" } : {}}
      animate={{ scale: active ? 1 : 0.95, y: active ? 0 : 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative w-full h-full cursor-grab active:cursor-grabbing">
        <Image
          src={profile.image}
          alt={profile.name}
          fill
          className="w-full h-full object-cover pointer-events-none"
        />

        {/* <div className="absolute inset-0 bg-linear-to-t from-black/95 via-black/80 to-transparent pointer-events-none"></div> */}

        <div className="absolute inset-0 bg-linear-to-t from-white/90 dark:from-black/95 via-white/40 dark:via-black/60 to-transparent pointer-events-none"></div>

        <div className="bottom-0 left-0 absolute p-6 w-full text-left pointer-events-auto">
          <h2
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/profile/${profile.id}`);
            }}
            className="group inline-flex items-center gap-2 drop-shadow-md mb-1 font-arima font-bold text-3xl tracking-wider active:scale-95 origin-left text-accent-blue-light cursor-pointer"
          >
            <span className="group-hover:[-webkit-text-stroke:1px_#FFFFFF] group-hover:text-transparent transition-all duration-300">
              {profile.name}
            </span>
            <span className="font-normal group-hover:[-webkit-text-stroke:0.5px_#FFFFFF] group-hover:text-transparent text-2xl transition-all duration-300 text-accent-blue-light">
              , {profile.age}
            </span>
          </h2>

          <div className="flex items-center gap-2 drop-shadow-md mb-3 font-medium text-accent-blue-light">
            <LuBriefcase size={18} />
            {profile.role}
          </div>

          <p className="mb-4 text-sm line-clamp-2 text-accent-purple-light">
            {profile.bio}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {profile.skills.map((skill) => (
              <span key={skill} className="badge badge-gradient">
                {skill}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-text-secondary text-xs">
            <LuMapPin size={14} />
            {profile.location} • {profile.distance} miles away
          </div>
        </div>

        <motion.div
          className="top-8 right-8 absolute bg-status-success-bg px-4 py-1 border-4 border-status-success-text rounded-xl font-bold text-status-success-text text-4xl uppercase tracking-widest rotate-12 pointer-events-none"
          style={{ opacity: useTransform(x, [0, 100], [0, 1]) }}
        >
          Connect
        </motion.div>
        <motion.div
          className="top-8 left-8 absolute bg-status-error-bg px-4 py-1 border-4 border-status-error-border rounded-xl font-bold text-status-error-text text-4xl uppercase tracking-widest -rotate-12 pointer-events-none"
          style={{ opacity: useTransform(x, [-100, 0], [1, 0]) }}
        >
          Pass
        </motion.div>
      </div>
    </motion.div>
  );
}
