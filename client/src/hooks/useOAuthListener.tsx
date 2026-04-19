"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/store";
import { CLIENT_URL } from "@/constants/env.constants";
import { defaultRoutes } from "@/lib/routes/routes";

type OAuthPayload = {
  status: string;
  message: string;
  data: {
    user: any;
    accessToken: string;
    expiresIn: number;
  };
};

type Options = {
  redirectTo?: string;
  onSuccess?: (data: OAuthPayload) => void;
  onError?: (error: any) => void;
};

export const useOAuthListener = (options?: Options) => {
  const router = useRouter();

  const setLoggedInUser = useAppStore((state) => state.setLoggedInUser);

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      try {
        if (CLIENT_URL && event.origin !== CLIENT_URL) {
          return;
        }

        const payload: OAuthPayload = event.data;

        if (!payload?.data?.accessToken) return;

        const { user } = payload.data;
        setLoggedInUser(user);

        options?.onSuccess?.(payload);

        if (options?.redirectTo) {
          router.replace(options.redirectTo);
        } else {
          router.replace(defaultRoutes.landing);
        }
      } catch (error) {
        options?.onError?.(error);
      }
    };

    window.addEventListener("message", handler);

    return () => window.removeEventListener("message", handler);
  }, []);
};
