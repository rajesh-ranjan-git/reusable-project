import { LuHeart, LuStar, LuX } from "react-icons/lu";
import { ActionBarProps } from "@/types/props/discover.props.types";

const ActionBar = ({ onSwipe, loadingProfiles }: ActionBarProps) => {
  return (
    <div className="z-(--z-raised) flex justify-center items-center gap-6 mt-6 px-4 w-full max-w-sm">
      <button
        onClick={() => onSwipe("left")}
        disabled={loadingProfiles}
        className="flex justify-center items-center disabled:opacity-50 p-0 rounded-full w-16 h-16 text-red-400 hover:scale-110 active:scale-95 transition-all disabled:cursor-not-allowed alert alert-error"
      >
        <LuX size={32} strokeWidth={3} />
      </button>

      <button
        onClick={() => onSwipe("super")}
        disabled={loadingProfiles}
        className="flex justify-center items-center disabled:opacity-50 p-0 rounded-full w-12 h-12 hover:scale-110 active:scale-95 transition-all disabled:cursor-not-allowed disabled:pointer-events-none alert alert-info"
      >
        <LuStar size={24} fill="currentColor" strokeWidth={0} />
      </button>

      <button
        onClick={() => onSwipe("right")}
        disabled={loadingProfiles}
        className="flex justify-center items-center disabled:opacity-50 rounded-full w-16 h-16 hover:scale-110 active:scale-95 transition-all disabled:cursor-not-allowed disabled:pointer-events-none alert alert-success"
      >
        <LuHeart size={32} fill="currentColor" strokeWidth={0} />
      </button>
    </div>
  );
};

export default ActionBar;
