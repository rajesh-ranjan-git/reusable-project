"use client";

import { useToast } from "@/hooks/toast";
import { fetchMe } from "@/lib/actions/actions";
import { authRoutes, defaultRoutes } from "@/lib/routes/routes";
import { useAppStore } from "@/store/store";
import { ReactNodeProps } from "@/types/propTypes";
import { toTitleCase } from "@/utils/common.utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type FetchMeResponseType = {
  user: {
    id: string;
  };
};

const AuthWrapper = ({ children }: ReactNodeProps) => {
  const [isChecking, setIsChecking] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  const { showToast } = useToast();

  const { loggedInUserId, setLoggedInUserId } = useAppStore();

  useEffect(() => {
    let isMounted = true;

    const validateUser = async () => {
      const isAuthRoute = Object.values(authRoutes).some((route) =>
        pathname.startsWith(route),
      );

      const isPublicRoute = isAuthRoute || pathname === defaultRoutes.landing;

      if (!isPublicRoute) {
        if (loggedInUserId) {
          if (isMounted) setIsChecking(false);
          return;
        }

        const response = await fetchMe();

        if (response?.success) {
          const data = response.data as FetchMeResponseType;

          setLoggedInUserId(data.user.id);

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
  }, [pathname, router, loggedInUserId, setLoggedInUserId]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
};

export default AuthWrapper;
