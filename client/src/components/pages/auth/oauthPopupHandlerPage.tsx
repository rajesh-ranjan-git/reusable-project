"use client";

import { CLIENT_URL } from "@/constants/env.constants";
import { useEffect } from "react";

const OAuthPopupHandlerPage = () => {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const data = JSON.parse(decodeURIComponent(params.get("data") as string));

    window.opener?.postMessage(data, CLIENT_URL);

    window.close();
  }, []);

  return (
    <div className="flex justify-center items-center bg-red-900 w-full h-full text-white">
      Logging you in...
    </div>
  );
};

export default OAuthPopupHandlerPage;
