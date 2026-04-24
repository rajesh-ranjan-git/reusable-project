import { mockActivities } from "@/lib/data/admin.data";

const ActivityFeed = () => {
  return (
    <div className="flex flex-col bg-bg-page-alt p-6 glass">
      <div className="flex justify-between items-center mb-6">
        <h4>Recent Activity</h4>
        <button className="btn btn-ghost">View all</button>
      </div>

      <div className="flex-1 space-y-2 pr-2 overflow-y-auto">
        {mockActivities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="group flex justify-between items-center hover:bg-glass-bg-hover p-2 rounded-md overflow-hidden"
            >
              <div className="flex items-center gap-2 pr-1 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full border flex items-center justify-center shrink-0 ${item.bg}`}
                >
                  <Icon className={`${item.color} w-5 h-5`} />
                </div>
                <div className="flex-1 pt-0.5 min-w-0">
                  <h6 className="font-medium text-text-primary truncate">
                    <span className="mr-1 font-medium text-sm">
                      {item.user}
                    </span>
                    <span className="text-text-secondary text-xs">
                      {item.action}
                    </span>
                  </h6>
                  <p className="text-[10px] text-text-secondary truncate">
                    {item.time}
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

export default ActivityFeed;
