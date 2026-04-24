import { LuBriefcase, LuBuilding2 } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { ExperienceProps } from "@/types/props/profile.props.types";
import { toTitleCase } from "@/utils/common.utils";
import { formatDate, getDuration } from "@/utils/date.utils";

const Experience = ({
  isOwnProfile,
  experiences,
  setCurrentForm,
}: ExperienceProps) => {
  return (
    <div className="relative mb-6 p-6 glass">
      <h3 className="mb-4 tracking-wider">Work Experience</h3>

      {isOwnProfile ? (
        <button
          className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
          onClick={() => setCurrentForm("experience")}
        >
          <MdOutlineEdit size={20} />
        </button>
      ) : null}

      <div className="space-y-0">
        {experiences?.length > 0
          ? experiences.map((experience, idx) => (
              <div key={idx} className="group flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center rounded-full w-10 h-10 transition-all shrink-0 glass">
                    {experience?.isCurrent ? (
                      <LuBriefcase size={18} className="text-accent-purple" />
                    ) : (
                      <LuBuilding2 size={18} className="text-text-secondary" />
                    )}
                  </div>
                  {idx !== experiences.length - 1 && (
                    <div className="divider-gradient-to-bottom" />
                  )}
                  {idx === experiences.length - 1 && (
                    <div className="mx-(--space-6)" />
                  )}
                </div>

                <div className="pb-8 w-full">
                  <p className="inline-block mb-2 rounded-md font-medium text-text-secondary text-xs badge badge-purple">
                    {experience?.startDate
                      ? formatDate(experience.startDate)
                      : null}
                    &nbsp;&mdash;&nbsp;
                    {experience?.isCurrent
                      ? "Present"
                      : experience?.endDate
                        ? formatDate(experience.endDate)
                        : null}
                    &nbsp;&bull;&nbsp;
                    {experience?.startDate
                      ? getDuration(experience?.startDate, experience?.endDate)
                      : null}
                  </p>

                  <div className="p-4 glass">
                    <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
                      <div>
                        <h6 className="break-all">
                          {toTitleCase(experience?.role)}
                        </h6>
                        <p className="mt-0.5 font-medium text-text-secondary text-xs md:text-sm">
                          {toTitleCase(experience?.company)}
                        </p>
                      </div>

                      {experience?.isCurrent
                        ? experience.isCurrent && (
                            <span className="badge badge-gradient shrink-0">
                              Current
                            </span>
                          )
                        : null}
                    </div>

                    {experience?.description
                      ? experience.description && (
                          <p className="text-text-secondary text-xs md:text-sm leading-relaxed">
                            {toTitleCase(experience.description)}
                          </p>
                        )
                      : null}
                  </div>
                </div>
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Experience;
