import figlet from "figlet";
import gradient from "gradient-string";
import boxen from "boxen";
import { HOST_PORT, MODE } from "../../constants/env.constants.js";
import { appConfig } from "../../config/common.config.js";
import {
  bannerFontsConfig,
  bannerThemesConfig,
} from "../../config/banner.config.js";
import { getDateToShow } from "../../utils/date.utils.js";
import { getRandomItem, toTitleCase } from "../../utils/common.utils.js";

const systemInfo = (port = HOST_PORT) => {
  const info = `
    Node: ${process.version}
    Port: ${port}
    Mode: ${toTitleCase(MODE)}
    Time: ${getDateToShow(new Date())}
  `;

  return boxen(info, {
    padding: { top: 0.5, right: 5, bottom: 0.5, left: 0.5 },
    borderColor: "cyan",
    borderStyle: "round",
  });
};

class BannerService {
  async showBanner(port = HOST_PORT) {
    try {
      const banner = getRandomItem(bannerThemesConfig);
      const bannerGradient = gradient(banner.gradient);
      const bannerDesc = getRandomItem(bannerThemesConfig);
      const bannerDescGradient = gradient(bannerDesc.gradient);

      figlet.text(
        appConfig.name.toUpperCase(),
        { font: bannerFontsConfig.ansiShadow.name },
        async (error, data) => {
          const output = bannerGradient.multiline(data);
          const desc = bannerDescGradient.multiline(appConfig.description);
          const sysInfo = systemInfo(port);

          console.log(`\n\n${output}\n${desc}\n\n${sysInfo}\n`);
        },
      );
    } catch (error) {
      logger.warn(`🚨 [BANNER FAILED] Unable to show banner:`, error);
      return;
    }
  }
}

export const bannerService = new BannerService();
