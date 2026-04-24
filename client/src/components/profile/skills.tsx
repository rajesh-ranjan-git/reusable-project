import Image from "next/image";
import { MdOutlineEdit } from "react-icons/md";
import { SkillsProps } from "@/types/props/profile.props.types";
import { toTitleCase } from "@/utils/common.utils";

const Skills = ({ isOwnProfile, skills, setCurrentForm }: SkillsProps) => {
  return (
    <div className="relative mb-6 p-6 glass">
      <h3 className="mb-4 tracking-wider">Tech Stack & Expertise</h3>

      {isOwnProfile ? (
        <button
          className="top-2 right-2 absolute px-2 text-sm btn btn-secondary"
          onClick={() => setCurrentForm("skills")}
        >
          <MdOutlineEdit size={20} />
        </button>
      ) : null}

      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <div
            key={skill.name}
            className="group relative pr-2 transition-all cursor-default btn btn-secondary"
          >
            {skill.icon && (
              <Image
                src={skill.icon}
                alt={skill.name}
                width={100}
                height={100}
                className="opacity-80 group-hover:opacity-100 w-4 h-4 transition-opacity"
              />
            )}
            <span className="font-medium text-text-secondary group-hover:text-text-primary text-sm transition-colors">
              {toTitleCase(skill.name)}
            </span>
            <span
              className={`ml-1 px-2 py-0.5 text-xs badge  ${skill.level === "expert" ? "badge-gradient" : skill.level === "advanced" ? "badge-purple" : skill.level === "intermediate" ? "badge-blue" : "glass"}`}
            >
              {toTitleCase(skill.level)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Skills;
