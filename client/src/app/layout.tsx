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
import Banner from "@/lib/banner/banner";
import ServiceWorkerRegister from "@/components/serviceWorker/serviceWorker";
import { ToastProvider } from "@/hooks/toast";
import ThemeManager from "@/components/theme/themeManager";
import Flash from "@/components/flash/flash";
import ErrorWrapper from "@/components/errors/errorWrapper";
import Orb from "@/components/background/orb";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "App Name",
    template: "%s | App Name",
  },
  description: "App's description.",
  manifest: "/manifest/manifest.json",
  themeColor: "#6366f1",
};

const RootLayout = ({ children }: Readonly<ReactNodeProps>) => {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${alkatra.variable} ${arima.variable} ${inter.variable} ${poppins.variable} ${tourney.variable} antialiased`}
        suppressHydrationWarning
      >
        <ServiceWorkerRegister />
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
};

export default RootLayout;
