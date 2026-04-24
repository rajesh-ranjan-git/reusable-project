import { IoMdRefresh } from "react-icons/io";

const Reload = () => {
  return (
    <div className="flex justify-center items-center gap-4 w-full text-center">
      <button
        type="button"
        className="group bg-status-success-bg border-status-success-border text-status-success-text btn btn-secondary"
        onClick={() => {
          window.location.reload();
        }}
      >
        <IoMdRefresh size={20} className="group-hover:animate-spin" />
        <span className="font-medium">Reload</span>
      </button>
    </div>
  );
};

export default Reload;
