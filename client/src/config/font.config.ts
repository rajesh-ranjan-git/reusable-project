import { Lobster, Satisfy } from "next/font/google";
import { Alkatra, Arima, Poppins } from "next/font/google";

export const alkatra = Alkatra({
  subsets: ["latin"],
  variable: "--font-alkatra",
  display: "swap",
});

export const arima = Arima({
  subsets: ["latin"],
  variable: "--font-arima",
  display: "swap",
});

export const poppins = Poppins({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const lobster = Lobster({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-lobster",
  display: "swap",
});
