import { FiCheckCircle } from "react-icons/fi";

const DiscoverEmpty = () => {
  return (
    <div className="p-8 border w-full text-center glass">
      <div className="flex justify-center items-center bg-status-success-bg mx-auto mb-6 border border-status-success-border rounded-full w-20 h-20 text-status-success-text">
        <FiCheckCircle size={32} />
      </div>

      <h3 className="mb-2 font-bold text-text-primary text-xl">
        You&apos;re all caught up!
      </h3>

      <p className="text-text-secondary text-sm">
        We&apos;re looking for more developers. Check back later.
      </p>
    </div>
  );
};

export default DiscoverEmpty;
