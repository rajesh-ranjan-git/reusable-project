import { LuBriefcase, LuBuilding2 } from "react-icons/lu";
import { MdOutlineEdit } from "react-icons/md";
import { toTitleCase } from "@/utils/common.utils";
import { Dispatch, SetStateAction } from "react";

type Experience = {
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  description: string | null;
} | null;

type CurrentFormType = "bio" | "skills" | "interests" | "experience" | null;

type ExperienceSectionProps = {
  isOwnProfile: boolean;
  experiences: Experience[];
  setCurrentForm: Dispatch<SetStateAction<CurrentFormType>>;
};

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

const getDuration = (startDate: string, endDate: string | null): string => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date();

  const totalMonths =
    (end.getFullYear() - start.getFullYear()) * 12 +
    (end.getMonth() - start.getMonth());

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? "s" : ""}`);
  if (months > 0) parts.push(`${months} mo${months > 1 ? "s" : ""}`);

  return parts.join(" ") || "< 1 mo";
};

const ExperienceSection = ({
  isOwnProfile,
  experiences,
  setCurrentForm,
}: ExperienceSectionProps) => {
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

export default ExperienceSection;
