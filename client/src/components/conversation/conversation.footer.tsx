import { LuPaperclip, LuSend } from "react-icons/lu";
import { ConversationFooterProps } from "@/types/props/conversation.props";
import FormTextarea from "@/components/forms/shared/form.textarea";

const ConversationFooter = ({
  textareaRef,
  handleInput,
  handleKeyDown,
  isSending,
  handleSend,
  draft,
}: ConversationFooterProps) => {
  return (
    <div className="bottom-0 z-(--z-raised) md:static gap-2 md:gap-3 flex items-center absolute p-2 pb-1 glass-nav border-glass-border border-b-0 border-t border w-full">
      <button className="p-2 rounded-full h-max text-text-secondary hover:text-text-primary glass">
        <LuPaperclip size={18} />
      </button>

      <div className="w-full">
        <FormTextarea
          rows={1}
          ref={textareaRef}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={isSending}
          className="[&::-webkit-scrollbar]:hidden mt-1 pl-4 h-auto [-ms-overflow-style:none] overflow-y-auto resize-none [scrollbar-width:none]"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!draft.trim() || isSending}
        className="disabled:opacity-50 p-2 rounded-full h-max text-text-secondary hover:text-text-primary disabled:cursor-not-allowed glass"
      >
        <LuSend size={18} />
      </button>
    </div>
  );
};

export default ConversationFooter;
