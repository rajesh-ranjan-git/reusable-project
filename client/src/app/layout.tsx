import "@/app/globals.css";
import "@/services/logger/logger";
import type { Metadata, Viewport } from "next";
import { alkatra, arima, inter, poppins, tourney } from "@/config/font.config";
import { ReactNodeProps } from "@/types/propTypes";
import Banner from "@/services/banner/banner";
import ServiceWorkerRegister from "@/components/serviceWorker/serviceWorkerRegister";
import Orb from "@/components/background/orb";
import { ToastProvider } from "@/hooks/toast";
import ThemeManager from "@/components/theme/themeManager";
import Flash from "@/components/flash/flash";
import ErrorWrapper from "@/components/errors/errorWrapper";
import AuthWrapper from "@/components/auth/authWrapper";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "App Name",
    template: "%s | App Name",
  },
  description: "App's description.",
  manifest: "/manifest/manifest.json",
};

export const viewport: Viewport = {
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
          <AuthWrapper>
            <ErrorWrapper>{children}</ErrorWrapper>
          </AuthWrapper>
        </ToastProvider>
      </body>
    </html>
  );
};

export default RootLayout;
