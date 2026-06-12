import { SocialButtonProps } from "@/types/props/auth.props.types";

const SocialButton = ({
  provider,
  onClick,
  icon: Icon,
  iconOnly = false,
}: SocialButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${iconOnly ? "w-12 h-12 shrink-0" : "w-full px-4"} p-0 btn btn-secondary rounded-lg font-medium transition-colors focus:ring-2 focus:ring-accent-purple-dark focus:outline-none`}
      title={iconOnly ? `Sign in with ${provider}` : undefined}
    >
      <Icon size={20} className={provider === "Google" ? "text-white" : ""} />
      {!iconOnly && <span>Continue with {provider}</span>}
    </button>
  );
};

export default SocialButton;
