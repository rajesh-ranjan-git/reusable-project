import { toTitleCase } from "@/utils/common.utils";

interface InterestsProps {
  interests: string[] | null;
}

const Interests = ({ interests }: InterestsProps) => {
  if (!interests?.length) return;

  return (
    <div className="mb-6 p-6 glass">
      <h3 className="mb-4 tracking-wider">Interests & Hobbies</h3>

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
    </div>
  );
};

export default Interests;
