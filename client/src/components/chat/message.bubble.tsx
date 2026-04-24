import { MessageBubbleProps } from "@/types/props/chat.props";

const MessageBubble = ({ message, isOwn }: MessageBubbleProps) => {
  return (
    <div
      className={`flex w-full mb-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[75%] px-4 py-2 rounded-2xl shadow-sm ${
          isOwn
            ? "bg-status-success-bg text-status-success-text rounded-tr-sm border border-status-success-border"
            : "bg-status-info-bg text-status-info-text border-status-info-border rounded-tl-sm border "
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <span
          className={`text-[10px] block text-text-secondary mt-1 ${isOwn ? "text-right" : ""}`}
        >
          {message.time}
        </span>
      </div>
    </div>
  );
};

export default MessageBubble;
