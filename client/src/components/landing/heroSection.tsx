import Link from "next/link";
import { FaArrowRight, FaStar } from "react-icons/fa6";
import { LuChevronRight, LuCode } from "react-icons/lu";

const HeroSection = () => {
  return (
    <section className="pt-30 text-center animate-fade-in container">
      <div className="flex justify-center mb-4">
        <Link
          href={"/discover"}
          className="flex items-center gap-1.5 shadow-md hover:shadow-lg w-max transition-shadow ease-in-out badge badge-gradient"
        >
          <FaStar className="text-status-success-text" />
          App Name v1.0 is now live
          <LuChevronRight size={14} className="ml-1" />
        </Link>
      </div>
      <h1 className="mx-auto mb-5 max-w-195 font-arima font-bold">
        Find your perfect&nbsp;
        <span className="text-gradient">developer match</span>.
      </h1>
      <p className="mx-auto mb-9 max-w-130 text-text-secondary text-lg">
        A specialized networking platform where software engineers, designers,
        and tech innovators connect, collaborate, and build the future together.
      </p>
      <div className="flex flex-wrap justify-center items-center gap-3">
        <Link
          href={"/discover"}
          className="gap-2 px-7 py-3 text-lg btn btn-primary"
        >
          Start Matching Now
          <FaArrowRight size={18} />
        </Link>
        <Link href={"/chat"} className="px-6 py-3 text-lg btn btn-secondary">
          <LuCode size={18} />
          Go To Chats
        </Link>
      </div>

      <div className="inline-flex items-center gap-3 mt-8 px-5 py-2.5 glass rounded-(--border-radius-pill)">
        <div className="flex justify-center items-center gap-4 text-text-secondary text-sm">
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
              className="z-(--z-raised) relative border-2 border-bg rounded-full w-8 h-8"
            />
          </div>
          <p>Joined by 10,000+ developers worldwide</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
