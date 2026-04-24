"use client";

import { useEffect } from "react";
import figlet from "figlet";
import gradient from "gradient-string";
import boxen from "boxen";
import { appConfig } from "@/config/common.config";
import { toastVariantsConfig } from "@/config/toast.config";
import { bannerFontsConfig, bannerThemesConfig } from "@/config/banner.config";
import { BannerProps } from "@/types/props/common.props.types";
import { useToast } from "@/hooks/toast";
import { getRandomItem, toTitleCase } from "@/utils/common.utils";
import { getDateToShow } from "@/utils/date.utils";

const systemInfo = (nodeVersion: string) => {
  const env = process.env.NEXT_PUBLIC_NODE_ENV;

  const info = `
    Node: ${nodeVersion}
    Port: ${process.env.NEXT_PUBLIC_CLIENT_PORT}
    Mode: ${toTitleCase(env)}
    Time: ${getDateToShow(new Date())}
  `;

  return boxen(info, {
    padding: { top: 0.5, right: 5, bottom: 0.5, left: 0.5 },
    borderColor: "cyan",
    borderStyle: "round",
  });
};

const Banner = ({ nodeVersion }: BannerProps) => {
  const { showToast } = useToast();

  const banner = getRandomItem(bannerThemesConfig);
  const bannerGradient = gradient(banner?.gradient);
  const bannerDesc = getRandomItem(bannerThemesConfig);
  const bannerDescGradient = gradient(bannerDesc?.gradient);

  useEffect(() => {
    fetch(bannerFontsConfig.ansiShadow.url)
      .then((res) => res.text())
      .then((font) => {
        figlet.parseFont("ANSI Shadow", font);

        figlet.text(
          appConfig.name.toUpperCase(),
          { font: bannerFontsConfig.ansiShadow.name },
          async (error: any, data: any) => {
            if (error) {
              logger.warn(`🚨 [BANNER FAILED] Unable to show banner:`, error);
              showToast({
                title: "BANNER ERROR",
                message: "An error occurred while creating console banner",
                variant: toastVariantsConfig.error,
              });
              return;
            }

            const output = bannerGradient.multiline(data as string);
            const desc = bannerDescGradient.multiline(appConfig.description);
            const sysInfo = systemInfo(nodeVersion);

            console.log(`\n${output}\n${desc}\n\n${sysInfo}\n\n`);
            console.log("");
          },
        );
      })
      .catch((error) => {
        logger.warn(`🚨 [BANNER FAILED] Unable to show banner:`, error);
        showToast({
          title: "BANNER ERROR",
          message: "An error occurred while creating console banner",
          variant: toastVariantsConfig.error,
        });
      });
  }, []);

  return null;
};

export default Banner;
