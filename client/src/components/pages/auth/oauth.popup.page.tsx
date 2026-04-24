"use client";

import { useEffect } from "react";
import { TbLoader3 } from "react-icons/tb";
import { CLIENT_URL } from "@/constants/env.constants";

const OAuthPopupPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = JSON.parse(decodeURIComponent(params.get("data") as string));

    window.opener?.postMessage(data, CLIENT_URL);

    window.close();
  }, []);

  return (
    <div className="flex justify-center items-center gap-2 w-full h-screen text-white text-2xl">
      <TbLoader3 size={40} className="animate-spin" />
      <span>Logging you in...</span>
    </div>
  );
};

export default OAuthPopupPage;
