"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AppSidebarProps,
  ReactNodeProps,
} from "@/types/props/common.props.types";
import { NetworkActionsProvider } from "@/hooks/useNetworkActions";
import Header from "@/components/layout/header";
import AppSidebar from "@/components/layout/app.sidebar";
import BottomNavbar from "@/components/layout/bottom.navbar";

const APP_ROUTES = ["/discover", "/profile", "/conversation"];

const AppChrome = ({ children }: ReactNodeProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const pathname = usePathname();

  const isAppRoute = APP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const hasNetworkSidebar =
    pathname === "/discover" ||
    pathname.startsWith("/profile") ||
    pathname === "/conversation";
  const isConversationRoute = pathname.startsWith("/conversation");
  const activeTab = pathname.startsWith("/profile")
    ? "profile"
    : pathname.startsWith("/conversation")
      ? "chats"
      : "discover";
  const sidebarClassName =
    pathname === "/discover" ? "hidden xl:flex" : "hidden md:flex";
  const backgroundClassName = pathname.startsWith("/profile")
    ? "bg-bg"
    : "bg-bg-page";

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  const sidebarProps = useMemo<Omit<AppSidebarProps, "setIsSidebarOpen">>(
    () => ({}),
    [],
  );

  const networkActionsValue = useMemo(() => ({}), []);

  if (!isAppRoute) return <>{children}</>;

  if (isConversationRoute) {
    return (
      <NetworkActionsProvider value={networkActionsValue}>
        <div
          className={`flex flex-col ${backgroundClassName} h-dvh overflow-hidden text-text-primary`}
        >
          <Header
            type="default"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            sidebarProps={sidebarProps}
          />

          {children}
        </div>
      </NetworkActionsProvider>
    );
  }

  return (
    <NetworkActionsProvider value={networkActionsValue}>
      <div
        className={`flex flex-col ${backgroundClassName} h-dvh overflow-hidden text-text-primary`}
      >
        <Header
          type="default"
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          sidebarProps={sidebarProps}
        />

        <main className="relative flex flex-1 overflow-hidden">
          {hasNetworkSidebar && (
            <div className={sidebarClassName}>
              <AppSidebar
                setIsSidebarOpen={setIsSidebarOpen}
                {...sidebarProps}
              />
            </div>
          )}

          {children}
        </main>

        <BottomNavbar activeTab={activeTab} />
      </div>
    </NetworkActionsProvider>
  );
};

export default AppChrome;
