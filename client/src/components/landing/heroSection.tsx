import { LuChevronRight, LuCode } from "react-icons/lu";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex items-center pt-32 lg:pt-48 pb-20 lg:pb-32 min-h-[90vh] overflow-hidden">
      <div className="hidden md:block top-1/2 left-1/2 -z-10 absolute bg-primary/20 blur-[120px] rounded-full w-200 h-200 -translate-x-1/2 -translate-y-1/2 pointer-events-none mix-blend-screen"></div>

      <div className="z-10 relative mx-auto px-6 w-full max-w-7xl">
        <div className="flex flex-col items-center mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 mb-8 px-3 py-1 border border-white/10 rounded-full font-medium text-text-secondary text-sm transition-colors">
            <span className="flex bg-green-500 rounded-full w-2 h-2"></span>
            Your App Name v2.0 is now live
            <LuChevronRight size={14} className="ml-1" />
          </div>

          <h1 className="mb-6 font-bold text-white text-5xl md:text-7xl leading-[1.1] tracking-tighter">
            Find your perfect <br className="hidden md:block" />
            <span className="bg-clip-text bg-linear-to-r from-primary to-accent text-transparent">
              developer match.
            </span>
          </h1>

          <p className="mb-10 max-w-2xl text-text-secondary text-lg md:text-xl leading-relaxed">
            A specialized networking platform where software engineers,
            designers, and tech innovators connect, collaborate, and build the
            future together.
          </p>

          <div className="flex sm:flex-row flex-col justify-center items-center gap-4 w-full">
            <Link
              href="/chat"
              className="flex justify-center items-center gap-2 bg-primary hover:bg-indigo-500 shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] hover:shadow-[0_0_60px_-15px_rgba(79,70,229,0.7)] px-8 py-4 rounded-xl w-full sm:w-auto font-medium text-white transition-all hover:-translate-y-1 transform"
            >
              Start Matching Now
              <LuChevronRight size={18} />
            </Link>
            <Link
              href="#how-it-works"
              className="flex justify-center items-center gap-2 bg-white/5 hover:bg-white/10 px-8 py-4 border border-white/10 rounded-xl w-full sm:w-auto font-medium text-white transition-all hover:-translate-y-1 transform"
            >
              <LuCode size={18} />
              View Documentation
            </Link>
          </div>

          <div className="flex items-center gap-4 mt-16 text-text-secondary text-sm">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?u=1"
                alt="User"
                className="z-30 relative border-2 border-bg rounded-full w-8 h-8"
              />
              <img
                src="https://i.pravatar.cc/100?u=2"
                alt="User"
                className="z-20 relative border-2 border-bg rounded-full w-8 h-8"
              />
              <img
                src="https://i.pravatar.cc/100?u=3"
                alt="User"
                className="z-10 relative border-2 border-bg rounded-full w-8 h-8"
              />
            </div>
            <p>Joined by 10,000+ developers worldwide</p>
          </div>
        </div>
      </div>
    </section>
  );
}
