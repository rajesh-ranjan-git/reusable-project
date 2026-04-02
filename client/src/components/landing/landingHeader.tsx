import Link from "next/link";
import Image from "next/image";
import { staticImages } from "@/config/common.config";
import ThemeToggle from "@/components/theme/themeToggle";

export default function LandingHeader() {
  return (
    <header className="top-0 right-0 left-0 fixed md:px-6 w-full glass-nav z-(--z-sticky) backdrop-blur-sm h-16 md:h-20">
      <div className="flex justify-between items-center mx-auto px-6 md:px-8 max-w-7xl h-full">
        <Link href="/discover" className="group flex items-center gap-2">
          <Image
            src={staticImages.mainLogo.src}
            alt={staticImages.mainLogo.alt}
            width={100}
            height={100}
            className="shadow-md rounded-full w-10 md:w-12 h-auto select-none"
          />
          <span className="font-tourney font-semibold text-gradient text-xl md:text-3xl tracking-tight">
            App Name
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          <Link
            href="#features"
            className="text-sm transition-colors ease-in-out btn btn-ghost"
          >
            Features
          </Link>
          <Link
            href="#community"
            className="text-sm transition-colors ease-in-out btn btn-ghost"
          >
            Community
          </Link>
          <Link
            href="/subscription"
            className="text-sm transition-colors ease-in-out btn btn-ghost"
          >
            Subscription
          </Link>
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <span className="shadow-md badge badge-blue">v1.0</span>

          <ThemeToggle />

          <Link href="/login" className="text-sm btn btn-secondary">
            Log in
          </Link>

          <Link
            href="/discover"
            className="text-text-on-accent text-sm btn btn-primary"
          >
            Open App
          </Link>
        </div>

        <div className="md:hidden flex items-center gap-1">
          <ThemeToggle />

          <Link href="/login" className="px-4 py-1 btn btn-secondary">
            Log in
          </Link>
        </div>
      </div>
    </header>
  );
}
