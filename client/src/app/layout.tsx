import "@/app/globals.css";
import "@/services/logger/logger";
import type { Metadata, Viewport } from "next";
import { alkatra, arima, poppins, lobster } from "@/config/font.config";
import { ReactNodeProps } from "@/types/props/common.props.types";
import Banner from "@/services/banner/banner";
import { ToastProvider } from "@/hooks/toast";
import ServiceWorker from "@/components/service-worker/service.worker";
import Orb from "@/components/background/orb";
import ThemeManager from "@/components/theme/theme.manager";
import TanstackQueryProvider from "@/components/tanstack-query/tanstack.query.provider";
import ErrorWrapper from "@/components/errors/error.wrapper";
import AuthWrapper from "@/components/auth/auth.wrapper";
import AppChrome from "@/components/layout/app.chrome";

export const metadata: Metadata = {
  title: {
    absolute: "",
    default: "App",
    template: "%s | App",
  },
  description: "App's description.",
  icons: [
    {
      src: "/assets/logo/android/app-logo-48x48.png",
      sizes: "48x48",
      type: "image/png",
    },
    {
      src: "/assets/logo/android/app-logo-72x72.png",
      sizes: "72x72",
      type: "image/png",
    },
    {
      src: "/assets/logo/android/app-logo-96x96.png",
      sizes: "96x96",
      type: "image/png",
    },
    {
      src: "/assets/logo/android/app-logo-144x144.png",
      sizes: "144x144",
      type: "image/png",
    },
    {
      src: "/assets/logo/android/app-logo-192x192.png",
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: "/assets/logo/android/app-logo-512x512.png",
      sizes: "512x512",
      type: "image/png",
    },
  ],
  manifest: "/manifest/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#6366f1",
};

const RootLayout = ({ children }: Readonly<ReactNodeProps>) => {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        className={`${alkatra.variable} ${arima.variable} ${poppins.variable} ${lobster.variable} antialiased`}
        suppressHydrationWarning
      >
        <ServiceWorker />
        <TanstackQueryProvider>
          <ToastProvider>
            <Banner nodeVersion={process.version} />
            <ThemeManager />
            <Orb />

            <AuthWrapper>
              <AppChrome>
                <ErrorWrapper>{children}</ErrorWrapper>
              </AppChrome>
            </AuthWrapper>
          </ToastProvider>
        </TanstackQueryProvider>
      </body>
    </html>
  );
};

export default RootLayout;
