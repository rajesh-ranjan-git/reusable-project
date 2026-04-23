import { MdOutlineEdit } from "react-icons/md";
import { toTitleCase } from "@/utils/common.utils";
import { Dispatch, SetStateAction } from "react";

type CurrentFormType = "bio" | "skills" | "interests" | "experience" | null;

interface InterestsProps {
  isOwnProfile: boolean;
  interests: string[] | null;
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
}

const Interests = ({
  isOwnProfile,
  interests,
  setCurrentForm,
}: InterestsProps) => {
  if (!interests?.length) return;

  return (
    <div className="relative mb-6 p-6 glass">
      <h3 className="mb-4 tracking-wider">Interests & Hobbies</h3>

      {isOwnProfile ? (
        <button
          className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
          onClick={() => setCurrentForm("interests")}
        >
          <MdOutlineEdit size={20} />
        </button>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {interests.map((interest: string) => (
          <div
            key={`${interest}-${interest.length}`}
            className="group relative transition-all cursor-default btn btn-secondary"
          >
            <span className="font-medium text-text-secondary group-hover:text-text-primary text-sm transition-colors">
              {toTitleCase(interest)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Interests;
