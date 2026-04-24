import { themeConfig } from "@/config/common.config";
import { useAppStore } from "@/store/store";

const ThemeToggle = () => {
  const activeTheme = useAppStore((state) => state.activeTheme);
  const setActiveTheme = useAppStore((state) => state.setActiveTheme);

  const handleSwitchTheme = () => {
    if (activeTheme === themeConfig.dark) {
      setActiveTheme(themeConfig.light);
    } else {
      setActiveTheme(themeConfig.dark);
    }
  };

  return (
    <div className="p-0.5 md:p-1 rounded-full btn btn-secondary">
      <input
        type="checkbox"
        id="theme-toggle"
        checked={activeTheme === themeConfig.dark ? true : false}
        className="peer hidden w-0 h-0"
        onChange={handleSwitchTheme}
      />
      <label
        htmlFor="theme-toggle"
        className="block after:top-0.5 md:peer-checked:after:left-15.5 after:left-0.5 peer-checked:after:left-9.5 after:absolute relative bg-[#242424] after:bg-[linear-gradient(180deg,#ffcc89,#d8860b)] peer-checked:after:bg-[linear-gradient(180deg,#777,#3a3a3a)] peer-checked:bg-[#ebebeb] shadow-[inset_0_5px_15px_rgba(0,0,0,0.4),inset_0_-5px_15px_rgba(255,255,255,0.4)] after:shadow-black/20 after:shadow-lg rounded-4xl after:rounded-full w-10 md:after:w-5 md:active:after:w-10 md:w-16 after:w-3 active:after:w-5 h-4 md:after:h-5 md:h-6 after:h-3 after:content-[''] transition-all after:transition-all peer-checked:after:-translate-x-full duration-500 after:duration-500 cursor-pointer"
      >
        <svg
          className={`top-[2.5px] left-[2.5px] md:top-1 md:left-1 z-(--z-dropdown) absolute ${
            activeTheme === themeConfig.dark ? "fill-[#7e7e7e]" : "fill-white"
          } w-2.75 md:w-4 transition-all duration-500`}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z"
            className={`${
              activeTheme === themeConfig.dark
                ? "stroke-[#7e7e7e]"
                : "stroke-white"
            } transition-all duration-500`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <svg
          className={`top-[2.5px] left-[26.5px] md:top-1 md:left-11 z-(--z-dropdown) absolute ${
            activeTheme === themeConfig.dark ? "fill-white" : "fill-[#7e7e7e]"
          } w-2.75 md:w-4 transition-all duration-500`}
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M3.32031 11.6835C3.32031 16.6541 7.34975 20.6835 12.3203 20.6835C16.1075 20.6835 19.3483 18.3443 20.6768 15.032C19.6402 15.4486 18.5059 15.6834 17.3203 15.6834C12.3497 15.6834 8.32031 11.654 8.32031 6.68342C8.32031 5.50338 8.55165 4.36259 8.96453 3.32996C5.65605 4.66028 3.32031 7.89912 3.32031 11.6835Z"
            className={`${
              activeTheme === themeConfig.dark
                ? "stroke-white"
                : "stroke-[#7e7e7e]"
            } transition-all duration-500`}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </label>
    </div>
  );
};

export default ThemeToggle;
