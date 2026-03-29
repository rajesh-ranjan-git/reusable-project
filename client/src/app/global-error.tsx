"use client";

import "@/app/globals.css";
import {
  alkatra,
  arima,
  inter,
  poppins,
  tourney,
  errorsConfig,
} from "@/config/config";
import { ToastProvider } from "@/hooks/toast";
import ThemeManager from "@/components/theme/themeManager";
import DefaultAnimatedBackground from "@/components/background/defaultAnimatedBackground";

export default function GlobalError() {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${inter.variable} ${alkatra.variable} ${arima.variable} ${tourney.variable} max-h-screen h-screen overflow-hidden`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <ThemeManager />
          <DefaultAnimatedBackground />
          <div className="flex flex-col justify-center items-center p-2">
            <div className="relative flex justify-center items-center w-full h-dvh overflow-hidden font-arima">
              <div className="flex flex-col justify-center items-center gap-8 bg-error-bg p-2 border border-error-border rounded-xl w-full max-w-7xl h-[95%] text-error-text-primary">
                <h2 className="font-bold text-2xl text-center">
                  {errorsConfig.internalServerError.message}
                </h2>
                <button
                  type="button"
                  className="bg-error-accent px-8 py-2 border-success-border border-t border-b rounded-full text-success-text-primary hover:scale-105 transition-all ease-in-out cursor-pointer"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Refresh
                </button>
              </div>
            </div>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
