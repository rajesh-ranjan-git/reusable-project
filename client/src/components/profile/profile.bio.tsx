import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileBioProps } from "@/types/props/profile.props.types";
import { useAppStore } from "@/store/store";
import { toSentenceCase } from "@/utils/common.utils";

const ProfileBio = ({ bio, isOwnProfile }: ProfileBioProps) => {
  const setCurrentForm = useAppStore((state) => state.setCurrentProfileForm);

  return (
    <div className="relative mb-6 p-6 leading-relaxed glass">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="tracking-wide">About Me</h3>
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
                {toSentenceCase(bio)}
              </p>
            ))
        ) : (
          toSentenceCase(bio.trim())
        )
      ) : (
        <div className="relative p-5 text-text-muted text-sm glass-subtle">
          Add bio to show here...
        </div>
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
  );
};

export default ProfileBio;
