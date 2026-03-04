"use client";

import { useEffect } from "react";
import figlet from "figlet";
import gradient from "gradient-string";
import boxen from "boxen";

import {
  appConfig,
  bannerFontsConfig,
  bannerThemesConfig,
  errorsConfig,
} from "@/config/config";
import { BannerProps } from "@/types/propTypes";
import { TOAST_VARIANTS, useToast } from "@/hooks/toast";
import {
  getRandomItem,
  getTransformedDate,
  toTitleCase,
} from "@/lib/utils/utils";

const systemInfo = (nodeVersion: string) => {
  const env = process.env.NEXT_PUBLIC_MODE_ENV;

  const info = `
    Node: ${nodeVersion}
    Port: ${process.env.NEXT_PUBLIC_CLIENT_PORT}
    Mode: ${toTitleCase(env)}
    Time: ${getTransformedDate(new Date())}
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
              console.warn(
                "🚨 WARNING :: An error occurred while creating console banner :",
                error,
              );
              showToast({
                title: errorsConfig.bannerError.title,
                message: errorsConfig.bannerError.message,
                variant: TOAST_VARIANTS.error,
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
      .catch((err) => {
        console.warn(
          `🚨 WARNING :: ${errorsConfig.bannerError.title} - ${errorsConfig.bannerError.message} : ${err}`,
        );
        showToast({
          title: errorsConfig.bannerError.title,
          message: errorsConfig.bannerError.message,
          variant: TOAST_VARIANTS.error,
        });
      });
  }, []);

  return null;
};

export default Banner;
