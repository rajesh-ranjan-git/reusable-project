"use client";

import { useRouter } from "next/navigation";
import { LuArrowLeft } from "react-icons/lu";

const GoBackButton = () => {
  const router = useRouter();

  return (
    <div className="flex justify-center items-center gap-4 w-full text-center">
      <button
        type="button"
        className="group bg-status-warning-bg border-status-warning-border text-status-warning-text btn btn-secondary"
        onClick={() => router.back()}
      >
        <LuArrowLeft
          size={20}
          className="transition-transform group-hover:-translate-x-1"
        />
        <span className="font-medium">Go Back</span>
      </button>
    </div>
  );
};

export default GoBackButton;
