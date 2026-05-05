import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileBioProps } from "@/types/props/profile.props.types";
import { toTitleCase } from "@/utils/common.utils";
import BioForm from "@/components/forms/profile/bio.form";

const ProfileBio = ({
  bio,
  isOwnProfile,
  setUserProfile,
  currentForm,
  setCurrentForm,
}: ProfileBioProps) => {
  return (
    <>
      <div className="relative mb-6 p-6 leading-relaxed glass">
        <div className="flex flex-col gap-1 mb-4">
          <span className="font-semibold text-xs uppercase tracking-[0.28em] text-accent-purple">
            Bio
          </span>
          <h3 className="tracking-wider">About</h3>
          <p className="max-w-2xl text-text-secondary text-sm">
            A quick snapshot of background, personality, and what defines the
            journey.
          </p>
        </div>

        {bio ? (
          bio?.trim().split("\n").length > 0 ? (
            bio
              .trim()
              .split("\n")
              .map((bio, idx) => (
                <p key={`${bio.length}-${idx}`} className="text-text-primary">
                  {toTitleCase(bio)}
                </p>
              ))
          ) : (
            toTitleCase(bio.trim())
          )
        ) : (
          <p className="text-text-muted">Add bio to show here...</p>
        )}

        {isOwnProfile ? (
          bio ? (
            <button
              className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
              onClick={() => setCurrentForm("bio")}
            >
              <MdOutlineEdit size={20} />
            </button>
          ) : (
            <button
              className="top-2 right-2 absolute flex items-center gap-2 pl-3 text-sm btn btn-secondary"
              onClick={() => setCurrentForm("bio")}
            >
              <IoMdAdd size={20} />
              <span className="hidden md:block">Add</span>
            </button>
          )
        ) : null}
      </div>

      <BioForm
        isOpen={currentForm === "bio"}
        onClose={() => setCurrentForm(null)}
        initialData={bio ?? ""}
        onSave={(updatedBio) => {
          setUserProfile((prev) => {
            if (!prev) return prev;

            return {
              ...prev,
              bio: updatedBio,
            };
          });
        }}
      />
    </>
  );
};

export default ProfileBio;
