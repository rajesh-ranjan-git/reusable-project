import { BiSolidErrorAlt } from "react-icons/bi";
import { DiscoverErrorProps } from "@/types/props/discover.props.types";

const DiscoverError = ({ error }: DiscoverErrorProps) => {
  if (!error) return;

  return (
    <div className="p-8 border w-full text-center glass">
      <div className="flex justify-center items-center bg-status-error-bg mx-auto mb-6 border border-status-error-border rounded-full w-20 h-20 text-status-error-text">
        <BiSolidErrorAlt size={32} />
      </div>

      <h3 className="mb-2 font-bold text-status-error-text text-xl">
        {error.code}
      </h3>

      <p className="text-text-secondary text-sm">{error.message}</p>
    </div>
  );
};

export default DiscoverError;
