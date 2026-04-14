"use client";

import Image from "next/image";
import { IoIosWarning } from "react-icons/io";
import { staticImages } from "@/config/common.config";
import GoBackButton from "@/components/ui/buttons/goBackButton";
import Header from "@/components/layout/header";
import { useState } from "react";

const NotFound = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
      <Header
        type="default"
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <main className="relative flex flex-1 overflow-hidden">
        <div className="relative flex flex-col flex-1 justify-center items-center gap-4 bg-status-warning-bg p-2 pb-20 md:pb-6 overflow-hidden">
          <div className="relative flex justify-center w-full overflow-hidden">
            <Image
              src={staticImages.notFoundError.src}
              alt={staticImages.notFoundError.alt}
              width={400}
              height={400}
              className="object-contain select-none"
            />
          </div>

          <div className="flex justify-center items-center gap-2 mx-auto">
            <IoIosWarning className="text-status-warning-text text-2xl md:text-5xl" />
            <h3 className="font-poppins text-status-warning-text text-lg md:text-3xl">
              The requested page does not exist!
            </h3>
          </div>

          <GoBackButton />
        </div>
      </main>
    </div>
  );
};

export default NotFound;
