import "@/app/globals.css";
import "@/lib/logger/logger";
import type { Metadata } from "next";
import {
  alkatra,
  arima,
  inter,
  poppins,
  tourney,
} from "@/config/common.config";
import { ReactNodeProps } from "@/types/propTypes";
import { ToastProvider } from "@/hooks/toast";
import Banner from "@/lib/banner/banner";
import ThemeManager from "@/components/theme/themeManager";
import DefaultAnimatedBackground from "@/components/background/defaultAnimatedBackground";
import Flash from "@/components/flash/flash";
import ErrorWrapper from "@/components/errors/errorWrapper";
import Orb from "@/components/background/orb";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "Your App Name",
    template: "%s | Your App Name",
  },
  description: "Your application's description.",
};

export default function RootLayout({ children }: Readonly<ReactNodeProps>) {
  return (
    <html lang="en">
      <body
        className={`${alkatra.variable} ${arima.variable} ${inter.variable} ${poppins.variable} ${tourney.variable} antialiased`}
        suppressHydrationWarning
      >
        <ToastProvider>
          <Banner nodeVersion={process.version} />
          <ThemeManager />
          <Orb />
          <Flash />
          <ErrorWrapper>{children}</ErrorWrapper>
        </ToastProvider>
      </body>
    </html>
  );
}
