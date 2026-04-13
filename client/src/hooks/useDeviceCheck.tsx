import { useEffect, useState } from "react";

type DeviceWidth = {
  isMobileWidth: boolean;
  isTabletWidth: boolean;
  isDesktopWidth: boolean;
};

const MOBILE_MAX_WIDTH = 767;
const TABLET_MAX_WIDTH = 1023;

export const useDeviceWidthCheck = (): DeviceWidth => {
  const [device, setDevice] = useState<DeviceWidth>({
    isMobileWidth: false,
    isTabletWidth: false,
    isDesktopWidth: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkWidth = () => {
      const width = window.innerWidth;

      setDevice({
        isMobileWidth: width <= MOBILE_MAX_WIDTH,
        isTabletWidth: width > MOBILE_MAX_WIDTH && width <= TABLET_MAX_WIDTH,
        isDesktopWidth: width > TABLET_MAX_WIDTH,
      });
    };

    checkWidth();

    window.addEventListener("resize", checkWidth);

    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return device;
};
