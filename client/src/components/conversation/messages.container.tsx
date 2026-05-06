import { MessagesContainerProps } from "@/types/props/conversation.props";
import MessageBubble from "@/components/conversation/message.bubble";

const MessagesContainer = ({
  messagesContainerRef,
  shouldAutoScrollRef,
  isLoadingMessages,
  displayMessages,
  messages,
  isSending,
  setNewMessagesCount,
  persistAndEmitMessage,
}: MessagesContainerProps) => {
  const isMessagesContainerNearBottom = () => {
    const el = messagesContainerRef.current;
    if (!el) return true;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;

    return distanceFromBottom <= 64;
  };

  const handleMessagesScroll = () => {
    const isNearBottom = isMessagesContainerNearBottom();

    shouldAutoScrollRef.current = isNearBottom;

    if (isNearBottom) {
      setNewMessagesCount(0);
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
        displayMessages.map((message) => (
          <MessageBubble
            key={message.messageId}
            message={message}
            onResend={handleResend}
          />
        ))
      ) : (
        <div className="flex flex-1 justify-center items-center text-text-secondary text-sm">
          No messages yet.
        </div>
      )}
    </div>
  );
};

export default MessagesContainer;
