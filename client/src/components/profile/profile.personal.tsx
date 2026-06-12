import { MdOutlineEdit, MdVerifiedUser } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { LuArrowRight } from "react-icons/lu";
import { ProfilePersonalProps } from "@/types/props/profile.props.types";
import { useAppStore } from "@/store/store";
import { getPersonalDetails } from "@/helpers/profile.helpers";
import { formatDate } from "@/utils/date.utils";

const ProfilePersonal = ({
  userProfile,
  isOwnProfile,
}: ProfilePersonalProps) => {
  const currentForm = useAppStore((state) => state.currentProfileForm);
  const setCurrentForm = useAppStore((state) => state.setCurrentProfileForm);

  const visibleDetails = getPersonalDetails(userProfile).filter(
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
            <h3 className="tracking-wide">Personal Details</h3>
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
                icon: Icon,
                isVerified,
                canVerify,
              }) => {
                const valueToShow =
                  key === "dob" ? (
                    userProfile?.dob ? (
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
                    )
                  ) : (
                    value
                  );
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
                            <Icon size={16} />
                          </span>
                          <p className="font-bold text-text-muted text-xs truncate uppercase tracking-[0.18em]">
                            {label}
                          </p>
                        </div>

                        {isOwnProfile ? (
                          !hasValue ? (
                            <button
                              className="relative flex gap-0 opacity-100 md:group-hover:opacity-100 md:opacity-0 p-1.5 md:pr-2.5 text-sm transition-opacity duration-200 btn btn-secondary"
                              onClick={() => setCurrentForm(key)}
                            >
                              <IoMdAdd size={16} />
                              <span className="hidden md:block">Add</span>
                            </button>
                          ) : key !== "gender" && key !== "dob" ? (
                            <button
                              type="button"
                              className="relative flex-none opacity-100 md:group-hover:opacity-100 md:opacity-0 p-1.5 text-sm transition-opacity duration-200 btn btn-ghost"
                              onClick={() => setCurrentForm(key)}
                              aria-label={`${hasValue ? "Edit" : "Add"} ${label}`}
                            >
                              <MdOutlineEdit size={16} />
                            </button>
                          ) : null
                        ) : null}
                      </div>

                      <div className="divider-gradient-to-right my-4" />

                      <div className="flex flex-1 items-end min-w-0">
                        <div className="flex justify-between items-center w-full min-w-0">
                          <div
                            className={`min-w-0 flex-1 truncate font-semibold text-sm leading-snug ${
                              hasValue
                                ? "text-text-primary"
                                : "text-text-muted italic font-normal"
                            }`}
                          >
                            {hasValue ? valueToShow : emptyText}
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
                              onClick={() => setCurrentForm("verifyEmail")}
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
    </>
  );
};

export default ProfilePersonal;
