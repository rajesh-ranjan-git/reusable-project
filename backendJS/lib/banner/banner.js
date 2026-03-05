import figlet from "figlet";
import gradient from "gradient-string";
import boxen from "boxen";

import {
  appConfig,
  bannerThemesConfig,
  errorsConfig,
} from "../../config/config.js";
import {
  getRandomItem,
  getTransformedDate,
  toTitleCase,
} from "../utils/utils.js";

const systemInfo = (port = process.env.PORT) => {
  const env = process.env.MODE_ENV;

  const info = `
    Node: ${process.version}
    Port: ${port}
    Mode: ${toTitleCase(env)}
    Time: ${getTransformedDate(new Date())}
  `;

  return boxen(info, {
    padding: { top: 0.5, right: 5, bottom: 0.5, left: 0.5 },
    borderColor: "cyan",
    borderStyle: "round",
  });
};

export const showBanner = async (port = process.env.PORT) => {
  try {
    const banner = getRandomItem(bannerThemesConfig);
    const bannerGradient = gradient(banner.gradient);
    const bannerDesc = getRandomItem(bannerThemesConfig);
    const bannerDescGradient = gradient(bannerDesc.gradient);

    figlet.text(
      appConfig.name.toUpperCase(),
      { font: bannerFonts.ansiShadow },
      async (error, data) => {
        const output = bannerGradient.multiline(data);
        const desc = bannerDescGradient.multiline(appConfig.description);
        const sysInfo = systemInfo(port);

        console.log(`\n\n${output}\n${desc}\n\n${sysInfo}\n`);
      },
    );
  } catch (error) {
    logger.warn(
      `🚨 ${errorsConfig.bannerError.title} - ${errorsConfig.bannerError.message} : `,
      error,
    );
    return;
  }
};
