"use client";

import "@/app/globals.css";
import "@/lib/logger/logger";
import Image from "next/image";
import { MdError } from "react-icons/md";
import {
  alkatra,
  arima,
  inter,
  poppins,
  staticImages,
  tourney,
} from "@/config/common.config";
import { ToastProvider } from "@/hooks/toast";
import ThemeManager from "@/components/theme/themeManager";
import Orb from "@/components/background/orb";
import Flash from "@/components/flash/flash";
import AppSidebar from "@/components/layout/appSidebar";
import ReloadButton from "@/components/ui/buttons/reloadButton";
import Header from "@/components/layout/header";
import { useState } from "react";

const GlobalError = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${alkatra.variable} ${arima.variable} ${tourney.variable} antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <ThemeManager />
          <Orb />
          <Flash />

          <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
            <Header
              type="default"
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            <main className="relative flex flex-1 overflow-hidden">
              <div className="hidden xl:flex">
                <AppSidebar />
              </div>

              <div className="relative flex flex-col flex-1 justify-center items-center gap-4 bg-status-error-bg p-2 pb-20 md:pb-6 overflow-hidden">
                <div className="relative flex justify-center w-full overflow-hidden">
                  <Image
                    src={staticImages.unexpectedError.src}
                    alt={staticImages.unexpectedError.alt}
                    width={500}
                    height={500}
                    className="object-contain select-none"
                  />
                </div>

                <div className="flex justify-center items-center gap-2 mx-auto">
                  <MdError className="text-status-error-text text-2xl md:text-5xl" />
                  <h3 className="font-poppins text-status-error-text text-lg md:text-3xl">
                    Oops! An unexpected error occurred.
                  </h3>
                </div>

                <ReloadButton />
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
};

export default GlobalError;
