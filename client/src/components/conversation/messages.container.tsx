import { MessagesContainerProps } from "@/types/props/conversation.props";
import MessageBubble from "@/components/conversation/message.bubble";

const MessagesContainer = ({
  messagesContainerRef,
  handleMessagesScroll,
  isLoadingMessages,
  displayMessages,
  handleResend,
}: MessagesContainerProps) => {
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
