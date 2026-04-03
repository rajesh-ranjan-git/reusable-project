import { LuHeart, LuStar, LuX } from "react-icons/lu";

type SwipeDirection = "left" | "right" | "super";

type ActionBarProps = {
  onSwipe: (direction: SwipeDirection, id?: number) => void;
};

export default function ActionBar({ onSwipe }: ActionBarProps) {
  return (
    <div className="z-(--z-raised) flex justify-center items-center gap-6 mt-6 px-4 w-full max-w-sm">
      <button
        onClick={() => onSwipe("left")}
        className="flex justify-center items-center p-0 rounded-full w-16 h-16 text-red-400 hover:scale-110 active:scale-95 transition-all alert alert-error"
      >
        <LuX size={32} strokeWidth={3} />
      </button>

      <button
        onClick={() => onSwipe("super")}
        className="flex justify-center items-center p-0 rounded-full w-12 h-12 hover:scale-110 active:scale-95 transition-all alert alert-info"
      >
        <LuStar size={24} fill="currentColor" strokeWidth={0} />
      </button>

      <button
        onClick={() => onSwipe("right")}
        className="flex justify-center items-center rounded-full w-16 h-16 hover:scale-110 active:scale-95 transition-all alert alert-success"
      >
        <LuHeart size={32} fill="currentColor" strokeWidth={0} />
      </button>
    </div>
  );
}
