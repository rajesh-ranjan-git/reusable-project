import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ExperienceType } from "@/types/types/profile.types";
import { ProfileExperienceProps } from "@/types/props/profile.props.types";
import Experience from "@/components/profile/experience";
import ExperienceForm from "@/components/forms/profile/experience.form";

const ProfileExperience = ({
  experiences,
  isOwnProfile,
  setUserProfile,
  currentForm,
  setCurrentForm,
}: ProfileExperienceProps) => {
  return (
    <>
      <div className="relative mb-6 p-6 leading-relaxed glass">
        <h3 className="mb-4 tracking-wider">Work Experience</h3>
        {experiences && experiences.length > 0 ? (
          <Experience experiences={experiences} />
        ) : (
          <p className="text-text-muted">
            Add your work experiences to show here...
          </p>
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

      <ExperienceForm
        isOpen={currentForm === "experience"}
        onClose={() => setCurrentForm(null)}
        initialData={experiences ?? []}
        onSave={(updatedExperiences: ExperienceType[]) => {
          setUserProfile((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              experiences: [...updatedExperiences],
            };
          });
        }}
      />
    </>
  );
};

export default ProfileExperience;
