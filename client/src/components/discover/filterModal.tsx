import { LuX } from "react-icons/lu";

type FilterModalProps = { isOpen: boolean; onClose: () => void };

const FilterModal = ({ isOpen, onClose }: FilterModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="z-(--z-raised)0 fixed inset-0 flex justify-center items-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      <div className="relative flex flex-col bg-bg shadow-2xl border border-black/10 dark:border-white/10 rounded-2xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center bg-white/90 dark:bg-surface/50 p-6 border-black/10 dark:border-white/10 border-b">
          <h2 className="font-semibold text-text-primary text-xl">
            Discovery Settings
          </h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        <div className="space-y-8 p-6 max-h-[60vh] overflow-y-auto">
          <div>
            <div className="flex justify-between mb-4">
              <label className="font-medium text-text-primary text-sm">
                Maximum Distance
              </label>
              <span className="font-medium text-primary text-sm">50 miles</span>
            </div>
            <input
              type="range"
              className="bg-black/10 dark:bg-white/10 rounded-lg w-full h-2 accent-primary appearance-none cursor-pointer"
              min="1"
              max="100"
              defaultValue="50"
            />
          </div>

          <div>
            <label className="block mb-4 font-medium text-text-primary text-sm">
              Looking For
            </label>
            <div className="gap-4 grid grid-cols-2">
              {[
                "Frontend",
                "Backend",
                "Full Stack",
                "Mobile",
                "UI/UX",
                "DevOps",
              ].map((role) => (
                <label
                  key={role}
                  className="group flex items-center gap-3 cursor-pointer"
                >
                  <div className="relative flex justify-center items-center bg-black/5 dark:bg-black/20 border border-black/20 dark:border-white/20 group-hover:border-primary rounded w-5 h-5 transition-colors">
                    <input
                      type="checkbox"
                      className="peer absolute opacity-0 w-full h-full cursor-pointer"
                    />
                    <div className="hidden peer-checked:block bg-primary rounded-sm w-3 h-3"></div>
                  </div>
                  <span className="text-text-secondary group-hover:text-text-primary text-sm transition-colors">
                    {role}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block mb-4 font-medium text-text-primary text-sm">
              Min. Experience
            </label>
            <select className="bg-black/5 dark:bg-black/20 px-4 py-3 border border-black/10 focus:border-primary/50 dark:border-white/10 rounded-lg focus:outline-none w-full text-text-primary text-sm transition-colors">
              <option value="any">Any Experience</option>
              <option value="junior">Junior (0-2 years)</option>
              <option value="mid">Mid-Level (3-5 years)</option>
              <option value="senior">Senior (5+ years)</option>
            </select>
          </div>
        </div>

        <div className="bg-white/90 dark:bg-surface/50 p-6 border-black/10 dark:border-white/10 border-t">
          <button
            onClick={onClose}
            className="bg-primary hover:bg-indigo-600 active:bg-indigo-700 shadow-lg shadow-primary/20 py-3 rounded-xl w-full font-medium text-white transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
