import { LuArrowDown } from "react-icons/lu";
import { NewMessagesButtonProps } from "@/types/props/conversation.props";

const NewMessagesButton = ({
  newMessagesCount,
  shouldAutoScrollRef,
  setNewMessagesCount,
  scrollMessagesToBottom,
}: NewMessagesButtonProps) => {
  const handleNewMessagesClick = () => {
    shouldAutoScrollRef.current = true;
    setNewMessagesCount(0);
    scrollMessagesToBottom();
  };

  return (
    newMessagesCount > 0 && (
      <button
        onClick={handleNewMessagesClick}
        className="right-4 bottom-24 md:bottom-20 z-(--z-raised) absolute flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium text-text-primary glass shadow-glass"
      >
        <LuArrowDown size={16} />
        {newMessagesCount}&nbsp;new&nbsp;
        {newMessagesCount === 1 ? "message" : "messages"}
      </button>
    )
  );
};

export default NewMessagesButton;
