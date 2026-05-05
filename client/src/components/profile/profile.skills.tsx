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
        <h3 className="mb-4 tracking-wider">Tech Stack & Expertise</h3>
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
