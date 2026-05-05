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
import { IoMdAdd } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";
import { PersonalDetail } from "@/types/types/profile.types";
import { ProfilePersonalProps } from "@/types/props/profile.props.types";
import { toTitleCase } from "@/utils/common.utils";
import { formatDate } from "@/utils/date.utils";
import EmailForm from "@/components/forms/profile/email.form";
import PhoneForm from "@/components/forms/profile/phone.form";
import GenderForm from "@/components/forms/profile/gender.form";
import RelationshipForm from "@/components/forms/profile/relationship.form";
import DobForm from "../forms/profile/dob.form";

const getGenderIcon = (gender?: string | null) => {
  if (gender === "male") return <FaMale size={18} />;
  if (gender === "female") return <FaFemale size={18} />;
  return <FaTransgender size={18} />;
};

const getMaritalStatusIcon = (maritalStatus?: string | null) => {
  if (maritalStatus === "married") return <FaHeart size={18} />;
  if (maritalStatus === "single") return <FaUser size={18} />;
  if (maritalStatus === "separated") return <FaPeopleArrows size={18} />;
  if (maritalStatus === "divorced") return <MdHeartBroken size={18} />;
  return <FaRandom size={18} />;
};

const ProfilePersonal = ({
  userProfile,
  isOwnProfile,
  currentForm,
  setCurrentForm,
}: ProfilePersonalProps) => {
  const details: PersonalDetail[] = [
    {
      key: "email",
      label: "Email",
      value: userProfile?.email,
      emptyText: "Add email address",
      icon: <MdEmail size={18} />,
      isVerified: userProfile?.emailVerified,
      canVerify: Boolean(userProfile?.email && !userProfile?.emailVerified),
    },
    {
      key: "phone",
      label: "Phone",
      value: userProfile?.phone ? String(userProfile.phone) : "",
      emptyText: "Add phone number",
      icon: <FaPhone size={16} />,
      isVerified: userProfile?.phoneVerified,
    },
    {
      key: "dob",
      label: "Birthday",
      value: userProfile?.dob ? (
        <span className="flex items-baseline gap-2">
          {formatDate(userProfile.dob)}
          {userProfile?.age ? (
            <span className="font-normal text-text-muted text-xs">
              {userProfile.age} yrs
            </span>
          ) : null}
        </span>
      ) : (
        ""
      ),
      emptyText: "Add birthday",
      icon: <FaBirthdayCake size={17} />,
    },
    {
      key: "gender",
      label: "Gender",
      value: userProfile?.gender ? toTitleCase(userProfile.gender) : "",
      emptyText: "Add gender",
      icon: getGenderIcon(userProfile?.gender),
    },
    {
      key: "maritalStatus",
      label: "Relationship",
      value: userProfile?.maritalStatus
        ? toTitleCase(userProfile.maritalStatus)
        : "",
      emptyText: "Add relationship status",
      icon: getMaritalStatusIcon(userProfile?.maritalStatus),
    },
  ];

  const visibleDetails = details.filter(
    ({ value }) => isOwnProfile || Boolean(value),
  );

  return (
    <>
      <div className="relative mb-6 p-6 overflow-hidden leading-relaxed glass">
        <div className="-top-16 -right-12 absolute blur-3xl rounded-full w-40 h-40 bg-accent-blue/10 pointer-events-none" />
        <div className="-bottom-20 -left-10 absolute blur-3xl rounded-full w-48 h-48 bg-accent-purple/10 pointer-events-none" />

        <div className="relative flex justify-between items-start gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-xs uppercase tracking-[0.28em] text-accent-purple">
              Profile Snapshot
            </span>
            <h3 className="tracking-wider">Personal Details</h3>
            <p className="max-w-2xl text-text-secondary text-sm">
              Contact and identity details in one quick, verified overview.
            </p>
          </div>
        </div>

        {userProfile && visibleDetails.length > 0 ? (
          <div className="relative gap-3 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
            {visibleDetails.map(
              ({
                key,
                label,
                value,
                emptyText,
                icon,
                isVerified,
                canVerify,
              }) => {
                const hasValue = Boolean(value);
                const isActive = currentForm === key;

                return (
                  <article
                    key={key}
                    className={`group relative overflow-hidden rounded-lg border transition-all duration-300 ${
                      isActive
                        ? "border-glass-border-accent bg-glass-bg-hover shadow-glass"
                        : "border-glass-border bg-glass-bg-subtle hover:border-glass-border-accent hover:bg-glass-bg-hover"
                    }`}
                  >
                    <div className="top-0 right-0 absolute w-30 h-30 group-hover:scale-125 transition-transform duration-300 pointer-events-none bg-(image:--bg-orb-3)" />

                    <div className="relative flex flex-col p-4 h-full">
                      <div className="flex justify-between items-center gap-2">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="flex flex-none justify-center items-center bg-linear-to-br shadow-glass border border-glass-border-accent rounded-md w-9 h-9 from-accent-blue/15 text-accent-purple to-accent-purple/20">
                            {icon}
                          </span>
                          <p className="font-bold text-text-muted text-xs truncate uppercase tracking-[0.18em]">
                            {label}
                          </p>
                        </div>

                        {isOwnProfile ? (
                          !hasValue ? (
                            <button
                              className="relative flex gap-0 opacity-0 group-hover:opacity-100 p-1.5 pr-2.5 text-sm btn btn-secondary"
                              onClick={() => setCurrentForm(key)}
                            >
                              <IoMdAdd size={16} />
                              <span className="hidden md:block">Add</span>
                            </button>
                          ) : key !== "gender" && key !== "dob" ? (
                            <button
                              type="button"
                              className="relative flex-none opacity-0 group-hover:opacity-100 p-1.5 text-sm transition-opacity duration-200 btn btn-ghost"
                              onClick={() => setCurrentForm(key)}
                              aria-label={`${hasValue ? "Edit" : "Add"} ${label}`}
                            >
                              <MdOutlineEdit size={16} />
                            </button>
                          ) : null
                        ) : null}
                      </div>

                      <div className="divider-gradient-to-right my-4" />

                      <div className="flex flex-1 items-end">
                        <div className="flex justify-between items-center w-full">
                          <div
                            className={`wrap-break-word font-semibold text-sm leading-snug ${
                              hasValue
                                ? "text-text-primary"
                                : "text-text-muted italic font-normal"
                            }`}
                          >
                            {hasValue ? value : emptyText}
                          </div>

                          {hasValue && isVerified ? (
                            <span className="inline-flex flex-none items-center gap-1 bg-status-success-bg px-2 py-0.5 border border-status-success-border rounded-pill font-medium text-[11px] text-status-success-text">
                              <MdVerifiedUser size={12} />
                              Verified
                            </span>
                          ) : null}

                          {hasValue && canVerify && isOwnProfile ? (
                            <button
                              type="button"
                              className="group/inner flex self-start px-3 py-1 text-xs bg-accent-purple-dark btn btn-primary"
                              onClick={() => setCurrentForm(key)}
                            >
                              <span>Verify now</span>
                              <span>
                                <LuArrowRight
                                  size={16}
                                  className="transition-all group-hover/inner:translate-x-1.5 ease-in-out"
                                />
                              </span>
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              },
            )}
          </div>
        ) : (
          <div className="relative p-5 text-text-muted text-sm glass-subtle">
            Personal details will show here once the profile is available.
          </div>
        )}
      </div>

      <EmailForm
        isOpen={currentForm === "email"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.email}
      />

      <PhoneForm
        isOpen={currentForm === "phone"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.phone?.toString()}
      />

      <DobForm
        isOpen={currentForm === "dob"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.dob}
      />

      <GenderForm
        isOpen={currentForm === "gender"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.maritalStatus}
      />

      <RelationshipForm
        isOpen={currentForm === "maritalStatus"}
        onClose={() => setCurrentForm(null)}
        initialData={userProfile?.maritalStatus}
      />
    </>
  );
};

export default ProfilePersonal;
