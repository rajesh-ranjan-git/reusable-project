import { useEffect, useState } from "react";
import { ScreenWidthType } from "@/types/types/hook.types";
import {
  MOBILE_MAX_SCREEN_WIDTH,
  TABLET_MAX_SCREEN_WIDTH,
} from "@/constants/common.constants";

const useScreenWidthCheck = (): ScreenWidthType => {
  const [screenWidth, setScreenWidth] = useState<ScreenWidthType>({
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
