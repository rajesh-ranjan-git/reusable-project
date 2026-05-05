import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileSkillsProps } from "@/types/props/profile.props.types";
import Skills from "@/components/profile/skills";
import SkillsForm from "@/components/forms/profile/skills.form";

const ProfileSkills = ({
  skills,
  isOwnProfile,
  setUserProfile,
  currentForm,
  setCurrentForm,
}: ProfileSkillsProps) => {
  return (
    <>
      <div className="relative mb-6 p-6 leading-relaxed glass">
        <div className="flex flex-col gap-1 mb-4">
          <h3 className="tracking-wider">Tech Stack & Expertise</h3>
          <p className="max-w-2xl text-text-secondary text-sm">
            Core technologies, tools, and expertise built through hands-on
            experience.
          </p>
        </div>

        {skills && skills.length > 0 ? (
          <Skills skills={skills} />
        ) : (
          <p className="text-text-muted">Add your skills to show here...</p>
        )}

        {isOwnProfile ? (
          skills ? (
            <button
              className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
              onClick={() => setCurrentForm("skills")}
            >
              <MdOutlineEdit size={20} />
            </button>
          ) : (
            <button
              className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
              onClick={() => setCurrentForm("skills")}
            >
              <IoMdAdd size={20} />
              <span className="hidden md:block">Add</span>
            </button>
          )
        ) : null}
      </div>

      <SkillsForm
        isOpen={currentForm === "skills"}
        onClose={() => setCurrentForm(null)}
        initialData={skills ?? []}
        onSave={(updatedSkills) => {
          setUserProfile((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              skills: updatedSkills,
            };
          });
        }}
      />
    </>
  );
};

export default ProfileSkills;
