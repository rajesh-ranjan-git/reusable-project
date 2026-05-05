import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileInterestsProps } from "@/types/props/profile.props.types";
import Interests from "@/components/profile/interests";
import InterestsForm from "@/components/forms/profile/interests.form";

const ProfileInterests = ({
  interests,
  isOwnProfile,
  setUserProfile,
  currentForm,
  setCurrentForm,
}: ProfileInterestsProps) => {
  return (
    <>
      <div className="relative mb-6 p-6 leading-relaxed glass">
        <h3 className="mb-4 tracking-wider">Interests & Hobbies</h3>
        {interests && interests.length > 0 ? (
          <Interests interests={interests} />
        ) : (
          <p className="text-text-muted">
            Add your interests and hobbies to show here...
          </p>
        )}

        {isOwnProfile ? (
          interests ? (
            <button
              className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
              onClick={() => setCurrentForm("interests")}
            >
              <MdOutlineEdit size={20} />
            </button>
          ) : (
            <button
              className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
              onClick={() => setCurrentForm("interests")}
            >
              <IoMdAdd size={20} />
              <span className="hidden md:block">Add</span>
            </button>
          )
        ) : null}
      </div>

      <InterestsForm
        isOpen={currentForm === "interests"}
        onClose={() => setCurrentForm(null)}
        onSave={(updatedInterests) => {
          setUserProfile((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              interests: updatedInterests,
            };
          });
        }}
        initialData={interests ?? []}
      />
    </>
  );
};

export default ProfileInterests;
