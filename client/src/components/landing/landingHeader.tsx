import Link from "next/link";
import { LuMenu } from "react-icons/lu";
import Image from "next/image";
import { staticImages } from "@/config/config";
import ThemeToggle from "@/components/theme/themeToggle";

export default function LandingHeader() {
  return (
    <header className="top-0 right-0 left-0 z-50 fixed backdrop-blur-md border-white/10 border-b h-20 transition-all">
      <div className="flex justify-between items-center mx-auto px-6 max-w-7xl h-full">
        <Link href="/discover" className="group flex items-center gap-2">
          <Image
            src={staticImages.mainLogo.src}
            alt={staticImages.mainLogo.alt}
            width={50}
            height={50}
            className="shadow-md rounded-full select-none"
          />
          <span className="font-bold text-white text-xl tracking-tight">
            Your App Name
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#features"
            className="font-medium text-text-secondary hover:text-white text-sm transition-colors"
          >
            Features
          </a>
          <a
            href="#community"
            className="font-medium text-text-secondary hover:text-white text-sm transition-colors"
          >
            Community
          </a>
          <a
            href="#pricing"
            className="font-medium text-text-secondary hover:text-white text-sm transition-colors"
          >
            Pricing
          </a>
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <Link
            href="/login"
            className="px-4 py-2 font-medium text-text-primary hover:text-primary text-sm transition-colors"
          >
            Log in
          </Link>
          <Link
            href="/discover"
            className="bg-primary hover:bg-primary/80 shadow-md shadow-primary/20 hover:shadow-primary/40 px-5 py-2.5 rounded-lg focus:ring-2 focus:ring-primary/50 font-medium text-white text-sm transition-all"
          >
            Open App
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button className="p-2 text-text-secondary hover:text-primary">
            <LuMenu size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
