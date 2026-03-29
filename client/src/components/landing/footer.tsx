import { staticImages } from "@/config/config";
import Image from "next/image";
import Link from "next/link";
import { LuGithub, LuLinkedin, LuTwitter } from "react-icons/lu";

export default function Footer() {
  return (
    <footer className="mt-auto pt-20 pb-10 border-white/10 border-t">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="gap-12 grid grid-cols-1 md:grid-cols-4 mb-16">
          <div className="md:col-span-1">
            <Link href="/discover" className="flex items-center gap-2 mb-6">
              <div className="flex justify-center items-center from-primary to-accent rounded w-8 h-8">
                <Image
                  src={staticImages.mainLogo.src}
                  alt={staticImages.mainLogo.alt}
                  width={50}
                  height={50}
                  className="shadow-md rounded-full select-none"
                />
              </div>
              <span className="font-bold text-white text-xl tracking-tight">
                Your App Name
              </span>
            </Link>
            <p className="mb-6 text-text-secondary text-sm leading-relaxed">
              Building the future of developer networking. Connect, pair
              program, and launch products together.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-text-secondary hover:text-white transition-colors"
              >
                <LuGithub size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-white transition-colors"
              >
                <LuTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-white transition-colors"
              >
                <LuLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Product</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Match Algorithm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-white">Company</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-white text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between items-center gap-4 pt-8 border-white/10 border-t">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} Your App Name Inc. All rights
            reserved.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex bg-green-500 rounded-full w-2 h-2"></span>
            <span className="text-text-secondary">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
