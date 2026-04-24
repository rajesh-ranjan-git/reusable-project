"use client";

import "@/app/globals.css";
import "@/services/logger/logger";
import { useState } from "react";
import Image from "next/image";
import { MdError } from "react-icons/md";
import { staticImagesConfig } from "@/config/common.config";
import { alkatra, arima, inter, poppins, tourney } from "@/config/font.config";
import { ToastProvider } from "@/hooks/toast";
import ThemeManager from "@/components/theme/theme.manager";
import Orb from "@/components/background/orb";
import Header from "@/components/layout/header";
import Reload from "@/components/ui/buttons/reload";

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

          <div className="flex flex-col bg-bg-page h-dvh overflow-hidden text-text-primary">
            <Header
              type="default"
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            <main className="relative flex flex-1 overflow-hidden">
              <div className="relative flex flex-col flex-1 justify-center items-center gap-4 bg-status-error-bg p-2 pb-20 md:pb-6 overflow-hidden">
                <div className="relative flex justify-center w-full overflow-hidden">
                  <Image
                    src={staticImagesConfig.unexpectedError.src}
                    alt={staticImagesConfig.unexpectedError.alt}
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

                <Reload />
              </div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
};

export default GlobalError;
