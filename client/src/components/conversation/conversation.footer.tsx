import { KeyboardEvent, useState } from "react";
import { LuPaperclip, LuSend } from "react-icons/lu";
import { UserProfileType } from "@/types/types/profile.types";
import { ConversationFooterProps } from "@/types/props/conversation.props";
import { MessageResponseType } from "@/types/types/message.types";
import { useAppStore } from "@/store/store";
import { getFullName } from "@/helpers/profile.helpers";
import FormTextarea from "@/components/forms/shared/form.textarea";

const ConversationFooter = ({
  conversationId,
  textareaRef,
  shouldAutoScrollRef,
  isSending,
  updateConversationWithMessage,
  upsertMessage,
  persistAndEmitMessage,
}: ConversationFooterProps) => {
  const [draft, setDraft] = useState("");

  const loggedInUser = useAppStore((state) => state.loggedInUser);

  const createPendingMessage = (content: string): MessageResponseType => {
    const now = new Date().toISOString();
    const clientMessageId = `local-${crypto.randomUUID()}`;
    const sender = {
      userId: loggedInUser?.userId ?? "",
      status: loggedInUser?.status,
      email: loggedInUser?.email ?? "",
      emailVerified: true,
      phoneVerified: false,
      userName: loggedInUser?.userName ?? "",
      firstName: loggedInUser?.firstName,
      lastName: loggedInUser?.lastName,
      fullName: getFullName(loggedInUser),
      avatar: loggedInUser?.avatar,
      createdAt: now,
      updatedAt: now,
    } as UserProfileType;

    return {
      id: clientMessageId,
      messageId: clientMessageId,
      clientMessageId,
      conversation: conversationId ?? "",
      sender,
      contentType: "text",
      content,
      attachments: [],
      location: null,
      replyTo: null,
      forwardedFrom: null,
      receipts: [],
      reactions: [],
      deletedAt: null,
      editHistory: [],
      callData: null,
      createdAt: now,
      updatedAt: now,
      deliveryStatus: "sending",
    };
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";

    const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);

    const maxHeight = lineHeight * 3;

    el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
    setDraft(el.value);
  };

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !conversationId || isSending) return;

    const pendingMessage = createPendingMessage(content);
    shouldAutoScrollRef.current = true;
    updateConversationWithMessage(pendingMessage, {
      activeConversationId: conversationId,
      incrementUnread: false,
    });
    upsertMessage(pendingMessage);
    setDraft("");
    if (textareaRef.current) textareaRef.current.value = "";
    resetHeight();

    await persistAndEmitMessage(pendingMessage.clientMessageId ?? "", content);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const resetHeight = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
  };

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
