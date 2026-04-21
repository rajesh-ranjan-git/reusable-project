import { IconType } from "react-icons";
import {
  LuCode,
  LuGitCommitHorizontal,
  LuGitMerge,
  LuStar,
} from "react-icons/lu";
import { MdDeleteSweep } from "react-icons/md";

type Activity = {
  type: string;
  date: string;
  title: string;
  description: string;
};

type ActivitySectionProps = { isOwnProfile: boolean; activities: Activity[] };

const ActivitySection = ({
  isOwnProfile,
  activities,
}: ActivitySectionProps) => {
  return (
    <div className="relative mb-8 md:mb-6 p-6 glass">
      <h3 className="mb-4 tracking-wider">Recent Activities</h3>

      {isOwnProfile ? (
        <button className="top-2 right-2 absolute pl-3 text-sm btn btn-secondary">
          <MdDeleteSweep size={20} />

          <span className="hidden md:block">Clear</span>
        </button>
      ) : null}

      <div className="space-y-0">
        {activities.map((activity, idx) => {
          let Icon: IconType = LuCode;
          let colorClass = "text-text-secondary";

          if (activity.type === "commit") {
            Icon = LuGitCommitHorizontal;
            colorClass = "text-green-400";
          }
          if (activity.type === "pr") {
            Icon = LuGitMerge;
            colorClass = "text-accent";
          }
          if (activity.type === "star") {
            Icon = LuStar;
            colorClass = "text-yellow-400";
          }
          if (activity.type === "hackathon") {
            Icon = LuCode;
            colorClass = "text-primary";
          }

          return (
            <div key={idx} className="group flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center rounded-full w-10 h-10 transition-all b shrink-0 glass">
                  <Icon size={18} className={colorClass} />
                </div>
                {idx !== activities.length - 1 && (
                  <div className="divider-gradient-to-bottom" />
                )}
                {idx === activities.length - 1 && (
                  <div className="mx-(--space-6)" />
                )}
              </div>
              <div className="pb-8 w-full">
                <p className="inline-block mb-2 rounded-md font-medium text-text-secondary text-xs badge badge-purple">
                  {activity.date}
                </p>
                <div className="p-4 glass">
                  <h6 className="mb-4 break-all">{activity.title}</h6>
                  <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                    {activity.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivitySection;
