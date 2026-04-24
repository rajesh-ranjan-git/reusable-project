import "@/app/globals.css";
import "@/services/logger/logger";
import type { Metadata, Viewport } from "next";
import { alkatra, arima, inter, poppins, tourney } from "@/config/font.config";
import { ReactNodeProps } from "@/types/props/common.props.types";
import Banner from "@/services/banner/banner";
import { ToastProvider } from "@/hooks/toast";
import ServiceWorker from "@/components/service-worker/service.worker";
import Orb from "@/components/background/orb";
import ThemeManager from "@/components/theme/theme.manager";
import ErrorWrapper from "@/components/errors/error.wrapper";
import AuthWrapper from "@/components/auth/auth.wrapper";

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
        <ServiceWorker />
        <ToastProvider>
          <Banner nodeVersion={process.version} />
          <ThemeManager />
          <Orb />

          <AuthWrapper>
            <ErrorWrapper>{children}</ErrorWrapper>
          </AuthWrapper>
        </ToastProvider>
      </body>
    </html>
  );
};

export default RootLayout;
