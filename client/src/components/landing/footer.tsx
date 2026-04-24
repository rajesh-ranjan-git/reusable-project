import Image from "next/image";
import Link from "next/link";
import { LuGithub, LuLinkedin, LuTwitter } from "react-icons/lu";
import { staticImagesConfig } from "@/config/common.config";
import { defaultRoutes } from "@/lib/routes/routes";

const Footer = () => {
  return (
    <footer className="mt-auto pt-10 pb-10 border-glass-border border-t">
      <div className="mx-auto px-6 max-w-7xl">
        <div className="gap-12 grid grid-cols-1 md:grid-cols-4 mb-16">
          <div className="md:col-span-1">
            <Link
              href={defaultRoutes.discover}
              className="group flex items-center gap-2 mb-6"
            >
              <Image
                src={staticImagesConfig.mainLogo.src}
                alt={staticImagesConfig.mainLogo.alt}
                width={100}
                height={100}
                className="shadow-glass-bg shadow-md rounded-full w-10 md:w-12 h-auto select-none"
              />
              <span className="font-tourney font-semibold text-gradient text-2xl md:text-3xl tracking-tight">
                App Name
              </span>
            </Link>

            <p className="mb-6 text-sm leading-relaxed">
              Building the future of developer networking. Connect, pair
              program, and launch products together.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <LuGithub size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <LuTwitter size={20} />
              </a>
              <a
                href="#"
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <LuLinkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-primary">Product</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Match Algorithm
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Changelog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-text-primary">Resources</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  API Reference
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Community
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-6 font-semibold text-text-primary">Company</h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-text-secondary hover:text-text-primary text-sm transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex md:flex-row flex-col justify-between items-center gap-4 pt-8 border-glass-border border-t">
          <p className="text-text-secondary text-sm">
            &copy; {new Date().getFullYear()} App Name Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="flex bg-status-success-text rounded-full w-2 h-2"></span>
            <span className="text-text-secondary">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
