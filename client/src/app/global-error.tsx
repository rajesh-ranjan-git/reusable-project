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
              <div className="flex flex-col justify-center items-center gap-8 bg-glass-error p-2 border border-glass-error-border rounded-xl w-full max-w-7xl h-[95%] text-glass-error-text">
                <h2 className="font-bold text-2xl text-center">
                  {errorsConfig.internalServerError.message}
                </h2>
                <button
                  type="button"
                  className="px-8 py-2 border-glass-success-border border-t border-b rounded-full text-glass-success-text hover:scale-105 transition-all ease-in-out bg-glass-accent-green-bright/50 hover:bg-glass-accent-green-bright/80 cursor-pointer"
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
