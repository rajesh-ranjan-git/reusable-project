import { useEffect, useState } from "react";

type ScreenWidth = {
  isMobileScreenWidth: boolean;
  isTabletScreenWidth: boolean;
  isDesktopScreenWidth: boolean;
};

const MOBILE_MAX_SCREEN_WIDTH = 767;
const TABLET_MAX_SCREEN_WIDTH = 1023;

const useScreenWidthCheck = (): ScreenWidth => {
  const [screenWidth, setScreenWidth] = useState<ScreenWidth>({
    isMobileScreenWidth: false,
    isTabletScreenWidth: false,
    isDesktopScreenWidth: false,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const checkScreenWidth = () => {
      const width = window.innerWidth;

      setScreenWidth({
        isMobileScreenWidth: width <= MOBILE_MAX_SCREEN_WIDTH,
        isTabletScreenWidth:
          width > MOBILE_MAX_SCREEN_WIDTH && width <= TABLET_MAX_SCREEN_WIDTH,
        isDesktopScreenWidth: width > TABLET_MAX_SCREEN_WIDTH,
      });
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return screenWidth;
};

export default useScreenWidthCheck;
