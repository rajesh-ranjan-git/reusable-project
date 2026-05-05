import {
  FaBirthdayCake,
  FaFemale,
  FaHeart,
  FaMale,
  FaPeopleArrows,
  FaPhone,
  FaRandom,
  FaTransgender,
  FaUser,
} from "react-icons/fa";
import {
  MdEmail,
  MdHeartBroken,
  MdOutlineEdit,
  MdVerifiedUser,
} from "react-icons/md";
import { ProfilePersonalProps } from "@/types/props/profile.props.types";
import { toTitleCase } from "@/utils/common.utils";
import { formatDate } from "@/utils/date.utils";

const ProfilePersonal = ({
  userProfile,
  setUserProfile,
  isOwnProfile,
  currentForm,
  setCurrentForm,
}: ProfilePersonalProps) => {
  return (
    <div className="relative mb-6 p-6 leading-relaxed glass">
      <h3 className="mb-4 tracking-wider">Personal Details</h3>

      {userProfile?.email ? (
        <p className="flex items-center gap-4 text-text-primary">
          <span>
            <MdEmail size={16} />
          </span>
          <span>{userProfile?.email}</span>

          {userProfile?.emailVerified ? (
            <span className="text-status-success-text">
              <MdVerifiedUser size={16} />
            </span>
          ) : null}

          {isOwnProfile ? (
            <button
              className="p-1 text-sm btn btn-ghost"
              onClick={() => setCurrentForm("email")}
            >
              <MdOutlineEdit size={16} />
            </button>
          ) : null}

          {!userProfile?.emailVerified ? (
            <button
              className="px-4 py-1 text-sm alert alert-success"
              onClick={() => setCurrentForm("email")}
            >
              Verify
            </button>
          ) : null}
        </p>
      ) : null}

      {userProfile?.dob ? (
        <p className="flex items-center gap-4 text-text-primary">
          <span>
            <FaBirthdayCake size={16} />
          </span>
          <span>Celebrate on {formatDate(userProfile?.dob)}</span>
          {isOwnProfile ? (
            <button
              className="p-1 text-sm btn btn-ghost"
              onClick={() => setCurrentForm("dob")}
            >
              <MdOutlineEdit size={16} />
            </button>
          ) : null}
        </p>
      ) : null}

      {userProfile?.gender ? (
        <p className="flex items-center gap-4 text-text-primary">
          <span>
            {userProfile?.gender === "male" ? (
              <FaMale size={16} />
            ) : userProfile?.gender === "female" ? (
              <FaFemale size={16} />
            ) : (
              <FaTransgender size={16} />
            )}
          </span>
          <span>{toTitleCase(userProfile?.gender)}</span>
          {isOwnProfile ? (
            <button
              className="p-1 text-sm btn btn-ghost"
              onClick={() => setCurrentForm("gender")}
            >
              <MdOutlineEdit size={16} />
            </button>
          ) : null}
        </p>
      ) : null}

      {userProfile?.phone ? (
        <p className="flex items-center gap-4 text-text-primary">
          <span>
            <FaPhone size={16} />
          </span>
          <span>{userProfile?.phone}</span>

          {userProfile?.phoneVerified ? (
            <span className="text-status-success-text">
              <MdVerifiedUser size={16} />
            </span>
          ) : null}

          {isOwnProfile ? (
            <button
              className="p-1 text-sm btn btn-ghost"
              onClick={() => setCurrentForm("phone")}
            >
              <MdOutlineEdit size={16} />
            </button>
          ) : null}

          {!userProfile?.phoneVerified ? (
            <button
              className="px-4 py-1 text-sm alert alert-success"
              onClick={() => setCurrentForm("email")}
            >
              Verify
            </button>
          ) : null}
        </p>
      ) : null}

      {userProfile?.maritalStatus ? (
        <p className="flex items-center gap-4 text-text-primary">
          <span>
            {userProfile?.maritalStatus === "married" ? (
              <FaHeart size={16} />
            ) : userProfile?.maritalStatus === "single" ? (
              <FaUser size={16} />
            ) : userProfile?.maritalStatus === "separated" ? (
              <FaPeopleArrows size={16} />
            ) : userProfile?.maritalStatus === "divorced" ? (
              <MdHeartBroken size={16} />
            ) : (
              <FaRandom size={16} />
            )}
          </span>
          <span>{toTitleCase(userProfile?.maritalStatus)}</span>
          {isOwnProfile ? (
            <button
              className="p-1 text-sm btn btn-ghost"
              onClick={() => setCurrentForm("maritalStatus")}
            >
              <MdOutlineEdit size={16} />
            </button>
          ) : null}
        </p>
      ) : null}
    </div>
  );
};

export default ProfilePersonal;
