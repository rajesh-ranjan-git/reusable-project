import { FiCheckCircle } from "react-icons/fi";
import { LuRefreshCw, LuUserPlus } from "react-icons/lu";
import { TbAlertCircle } from "react-icons/tb";

export const mockActivities = [
  {
    id: 1,
    type: "user_joined",
    user: "Alex Merced",
    action: "joined DevMatch",
    time: "5m ago",
    icon: LuUserPlus,
    color: "text-status-success",
    bg: "bg-status-success-bg border-status-success-border",
  },
  {
    id: 2,
    type: "subscription",
    user: "Sarah Connor",
    action: "upgraded to Premium",
    time: "12m ago",
    icon: LuRefreshCw,
    color: "text-status-success-text",
    bg: "bg-status-success-bg border-status-success-border",
  },
  {
    id: 3,
    type: "report",
    user: "System",
    action: "flagged suspicious account (ID: 942)",
    time: "1h ago",
    icon: TbAlertCircle,
    color: "text-status-error-text",
    bg: "bg-status-error-bg border-status-error-border",
  },
  {
    id: 4,
    type: "project_created",
    user: "David Kim",
    action: 'created a new squad "Web3 Dash"',
    time: "3h ago",
    icon: FiCheckCircle,
    color: "text-status-info-text",
    bg: "bg-status-info-bg border-status-info-border",
  },
  {
    id: 5,
    type: "user_joined",
    user: "Emily Chen",
    action: "joined DevMatch",
    time: "5h ago",
    icon: LuUserPlus,
    color: "text-status-success",
    bg: "bg-status-success-bg border-status-success-border",
  },
];
