"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/toast";

interface FlashMessage {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  authenticated: boolean;
}

export default function Flash() {
  const { showToast } = useToast();

  useEffect(() => {
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) {
        return parts.pop()?.split(";").shift() || null;
      }
      return null;
    };

    const deleteCookie = (name: string): void => {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    };

    const flashCookie = getCookie("flash");

    if (flashCookie) {
      try {
        const flashData: FlashMessage = JSON.parse(
          decodeURIComponent(flashCookie),
        );

        showToast({
          title: flashData.title,
          message: flashData.message,
          variant: flashData.type,
        });

        deleteCookie("flash");
      } catch (error) {
        console.warn("🚨 WARNING :: Error parsing flash cookie:", error);
        deleteCookie("flash");
      }
    }
  }, []);

  return null;
}
