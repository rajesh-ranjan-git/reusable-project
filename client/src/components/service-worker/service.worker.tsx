"use client";

import { useEffect } from "react";

const ServiceWorker = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker/service-worker.js", { scope: "/" })
        .then(() => logger.info("Service Worker registered successfully!"))
        .catch((err) =>
          logger.error("Unable to register Service Worker:", err),
        );
    }
  }, []);

  return null;
};

export default ServiceWorker;
