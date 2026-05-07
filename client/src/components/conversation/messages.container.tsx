import { useRef } from "react";
import { MessagesContainerProps } from "@/types/props/conversation.props";
import MessageBubble from "@/components/conversation/message.bubble";

const MessagesContainer = ({
  messagesContainerRef,
  shouldAutoScrollRef,
  isLoadingMessages,
  isLoadingOlderMessages,
  hasOlderMessages,
  displayMessages,
  messages,
  isSending,
  onLoadOlderMessages,
  setNewMessagesCount,
  persistAndEmitMessage,
}: MessagesContainerProps) => {
  // Tracks whether we have already called onLoadOlderMessages for the current
  // scroll-to-top gesture. Flips back to false once the container scrolls away
  // from the top zone, preventing repeated calls while the prop update for
  // isLoadingOlderMessages is still in flight from the parent.
  const hasFiredLoadOlderRef = useRef(false);

  const isMessagesContainerNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    return distanceFromBottom <= 64;
  };

  const handleMessagesScroll = () => {
    const el = messagesContainerRef.current;
    if (!el) return;

    const isNearBottom = isMessagesContainerNearBottom();

    shouldAutoScrollRef.current = isNearBottom;

    if (isNearBottom) {
      setNewMessagesCount(0);
    }

    // Reset the local fire-guard once the user scrolls back down out of the
    // trigger zone so the next deliberate scroll-to-top works correctly.
    if (el.scrollTop > 64) {
      hasFiredLoadOlderRef.current = false;
    }

    // Only fire if:
    // 1. There are older messages to load.
    // 2. The parent isn't already loading them (prop check — covers the settled
    //    state after the previous fetch completed).
    // 3. We haven't already fired for this scroll-to-top gesture (ref check —
    //    covers the in-flight window before isLoadingOlderMessages turns true).
    if (
      el.scrollTop <= 64 &&
      hasOlderMessages &&
      !isLoadingOlderMessages &&
      !hasFiredLoadOlderRef.current
    ) {
      hasFiredLoadOlderRef.current = true;
      onLoadOlderMessages();
    }
  };

  const handleResend = async (messageId: string) => {
    if (isSending) return;

    const failedMessage = messages.find(
      (message) =>
        message.messageId === messageId ||
        message.clientMessageId === messageId,
    );

    if (!failedMessage) return;

    await persistAndEmitMessage(
      failedMessage.clientMessageId ?? failedMessage.messageId ?? messageId,
      failedMessage.content,
    );
  };

  return (
    <div
      ref={messagesContainerRef}
      onScroll={handleMessagesScroll}
      className="z-(--z-base) relative flex flex-col flex-1 p-4 pb-20 md:pb-4 overflow-y-auto"
    >
      {isLoadingMessages ? (
        <div className="flex flex-1 justify-center items-center text-text-secondary text-sm">
          Loading messages...
        </div>
      ) : displayMessages.length > 0 ? (
        <>
          {isLoadingOlderMessages && (
            <div className="py-2 text-text-secondary text-xs text-center">
              Loading older messages...
            </div>
          )}

          {displayMessages.map((message) => (
            <MessageBubble
              key={message.messageId}
              message={message}
              onResend={handleResend}
            />
          ))}
        </>
      ) : (
        <div className="flex flex-1 justify-center items-center text-text-secondary text-sm">
          No messages yet.
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
