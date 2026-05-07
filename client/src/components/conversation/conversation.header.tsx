import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoMdMore } from "react-icons/io";
import { LuArrowLeft, LuPhone, LuVideo } from "react-icons/lu";
import { staticImagesConfig } from "@/config/common.config";
import { ConversationHeaderProps } from "@/types/props/conversation.props";
import { profileRoutes } from "@/lib/routes/routes";

const ConversationHeader = ({
  onBack,
  conversationDisplay,
}: ConversationHeaderProps) => {
  const router = useRouter();

  const otherParticipantProfileRoute =
    conversationDisplay?.conversation.type === "direct" &&
    conversationDisplay?.otherParticipants.length > 0
      ? `${profileRoutes.profile}/${conversationDisplay?.otherParticipants[0].user.userName}`
      : null;

  return (
    <div className="z-(--z-raised) flex justify-between items-center px-4 glass-nav h-16">
      <div className="flex items-center gap-2 md:gap-3">
        <button
          onClick={onBack}
          className="md:hidden -m-2 p-0 pr-2 text-text-secondary hover:text-text-primary transition-colors"
        >
          <LuArrowLeft size={28} />
        </button>
        <div className="relative shrink-0">
          <Image
            src={
              conversationDisplay?.avatar ??
              staticImagesConfig.avatarPlaceholder.src
            }
            alt={
              conversationDisplay?.title ??
              staticImagesConfig.avatarPlaceholder.alt
            }
            width={100}
            height={100}
            className="shadow-glass border hover:border-accent-purple-dark rounded-full w-10 h-10 object-cover cursor-pointer select-none shrink-0"
            onClick={() =>
              otherParticipantProfileRoute
                ? router.push(otherParticipantProfileRoute)
                : null
            }
          />
          {conversationDisplay?.isOnline ? (
            <span className="right-0 bottom-0 absolute bg-green-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
          ) : (
            <span className="right-0 bottom-0 absolute bg-gray-500 border-[#0B0F1A] border-2 rounded-full w-3 h-3"></span>
          )}
        </div>
        <div>
          <h6
            className="font-medium text-text-primary hover:text-text-link-hover truncate cursor-pointer select-none"
            onClick={() =>
              otherParticipantProfileRoute
                ? router.push(otherParticipantProfileRoute)
                : null
            }
          >
            {conversationDisplay?.title}
          </h6>
          <p
            className={`text-xs ${conversationDisplay?.isOnline ? "text-green-500" : "text-gray-500"}`}
          >
            {conversationDisplay?.participantsLabel}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 md:gap-3 text-text-secondary">
        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
          <LuPhone size={20} />
        </button>
        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
          <LuVideo size={20} />
        </button>
        <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary glass">
          <IoMdMore size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConversationHeader;
