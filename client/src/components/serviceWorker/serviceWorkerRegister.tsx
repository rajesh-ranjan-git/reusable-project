"use client";

import { useEffect } from "react";

const ServiceWorkerRegister = () => {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/serviceWorker/serviceWorker.js")
        .then(() => logger.info("Service Worker registered successfully!"))
        .catch((err) =>
          logger.error("Unable to register Service Worker:", err),
        );
    }
  }, []);

  return null;
};

export default ServiceWorkerRegister;
