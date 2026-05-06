import { IoMdAdd } from "react-icons/io";
import { MdOutlineEdit } from "react-icons/md";
import { ProfileInterestsProps } from "@/types/props/profile.props.types";
import Interests from "@/components/profile/interests";
import { useAppStore } from "@/store/store";

const ProfileInterests = ({
  interests,
  isOwnProfile,
}: ProfileInterestsProps) => {
  const setCurrentForm = useAppStore((state) => state.setCurrentProfileForm);

  return (
    <div className="relative mb-6 p-6 leading-relaxed glass">
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="tracking-wider">Interests & Hobbies</h3>
        <p className="max-w-2xl text-text-secondary text-sm">
          Passions, hobbies, and pursuits beyond work that keep life engaging.
        </p>
      </div>

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
  );
};

export default ProfileInterests;
