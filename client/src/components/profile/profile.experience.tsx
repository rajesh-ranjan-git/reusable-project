import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileExperienceProps } from "@/types/props/profile.props.types";
import { useAppStore } from "@/store/store";
import Experience from "@/components/profile/experience";

const ProfileExperience = ({
  experiences,
  isOwnProfile,
}: ProfileExperienceProps) => {
  const setCurrentForm = useAppStore((state) => state.setCurrentProfileForm);

  return (
    <div className="relative mb-6 p-6 leading-relaxed glass">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="tracking-wide">Work Experience</h3>
        <p className="max-w-2xl text-text-secondary text-sm">
          Professional journey, roles, and impact delivered along the way.
        </p>
      </div>

      {experiences && experiences.length > 0 ? (
        <Experience experiences={experiences} />
      ) : (
        <div className="relative p-5 text-text-muted text-sm glass-subtle">
          Add your work experiences to show here...
        </div>
      )}

      {isOwnProfile ? (
        experiences ? (
          <button
            className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
            onClick={() => setCurrentForm("experience")}
          >
            <MdOutlineEdit size={20} />
          </button>
        ) : (
          <button
            className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
            onClick={() => setCurrentForm("experience")}
          >
            <IoMdAdd size={20} />
            <span className="hidden md:block">Add</span>
          </button>
        )
      ) : null}
    </div>
  );
};

export default ProfileExperience;
