"use client";

import { useEffect } from "react";
import { TbLoader3 } from "react-icons/tb";
import { CLIENT_URL } from "@/constants/env.constants";

const OAuthPopupPage = () => {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawData = params.get("data");

      if (!rawData) {
        logger.error("❌ No OAuth data received");
        return;
      }

      const data = JSON.parse(decodeURIComponent(rawData));

      window.opener?.postMessage(data, CLIENT_URL);

      window.close();
    } catch (error) {
      logger.error("❌ OAuth popup error:", error);
    }
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 w-full h-screen text-white text-2xl">
      <TbLoader3 size={40} className="animate-spin" />
      <span>Logging you in...</span>
    </div>
  );
};

export default OAuthPopupPage;
