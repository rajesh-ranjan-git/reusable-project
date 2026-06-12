import { toTitleCase } from "@/utils/common.utils";
import { InterestsProps } from "@/types/props/profile.props.types";

const Interests = ({ interests }: InterestsProps) => {
  if (!interests?.length) return;

  return (
    <div className="flex flex-wrap gap-3">
      {interests.map((interest: string) => (
        <div
          key={`${interest}-${interest.length}`}
          className="group relative transition-all cursor-default btn btn-secondary"
        >
          <span className="font-medium text-text-secondary group-hover:text-text-primary text-sm transition-colors">
            {toTitleCase(interest)}
          </span>
        </div>
      ))}
    </div>
  );
};

export default Interests;
