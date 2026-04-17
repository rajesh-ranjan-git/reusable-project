"use client";

import { useToast } from "@/hooks/toast";
import { fetchMe, refreshTokens } from "@/lib/actions/actions";
import { getCookies } from "@/lib/api/cookiesHandler";
import { authRoutes, defaultRoutes } from "@/lib/routes/routes";
import { useAppStore } from "@/store/store";
import { ReactNodeProps } from "@/types/propTypes";
import { LoggedInUserType } from "@/types/types";
import { toTitleCase } from "@/utils/common.utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FetchMeResponseType = {
  user: LoggedInUserType;
};

type RefreshResponseType = {
  accessToken: string;
};

const AuthWrapper = ({ children }: ReactNodeProps) => {
  const [isChecking, setIsChecking] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const { showToast } = useToast();

  const loggedInUser = useAppStore((state) => state.loggedInUser);
  const setLoggedInUser = useAppStore((state) => state.setLoggedInUser);
  const accessToken = useAppStore((state) => state.accessToken);
  const setAccessToken = useAppStore((state) => state.setAccessToken);
  const isLoggingOut = useAppStore((state) => state.isLoggingOut);

  useEffect(() => {
    if (isLoggingOut) return;

    let isMounted = true;

    const validateUser = async () => {
      const isAuthRoute = Object.values(authRoutes).some((route) =>
        pathname.startsWith(route),
      );

      const isPublicRoute = isAuthRoute || pathname === defaultRoutes.landing;

      if (!isAuthRoute) {
        const refreshToken = await getCookies("refreshToken");

        if (!refreshToken && pathname === defaultRoutes.landing) {
          setAccessToken(null);
          setLoggedInUser(null);
        }
      }

      if (!isPublicRoute) {
        if (loggedInUser && accessToken) {
          if (isMounted) setIsChecking(false);
          return;
        }

        let token = accessToken;

        if (!token) {
          const refreshResponse = await refreshTokens();

          if (refreshResponse?.success) {
            const refreshData = refreshResponse.data as RefreshResponseType;

            token = refreshData.accessToken;
            setAccessToken(token);
          } else {
            showToast({
              title: "SESSION EXPIRED",
              message: "Your session has expired, please login again!",
              variant: "error",
            });

            router.push(authRoutes.login);
          }
        }

        const response = await fetchMe(token as string);

        if (response?.success) {
          const data = response.data as FetchMeResponseType;

          setLoggedInUser(data.user);

          if (isMounted) setIsChecking(false);
          return;
        }

        if (isMounted) {
          router.replace(`${authRoutes.login}?from=${pathname}`);
        }

        if (Number(response?.statusCode) >= 500) {
          showToast({
            title: toTitleCase(response.code),
            message: response.message ?? "",
            variant: "error",
          });
        }
      }

      if (isMounted) setIsChecking(false);
    };

    validateUser();

    return () => {
      isMounted = false;
    };
  }, [
    pathname,
    router,
    loggedInUser,
    accessToken,
    setLoggedInUser,
    setAccessToken,
  ]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
