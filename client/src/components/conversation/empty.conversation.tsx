import { LuMessageCircle } from "react-icons/lu";

const EmptyConversation = () => {
  return (
    <div className="hidden relative md:flex flex-col flex-1 justify-center items-center gap-2">
      <div className="flex justify-center items-center mb-4 rounded-full w-16 h-16 text-text-secondary glass">
        <LuMessageCircle size={32} />
      </div>
      <h3>Your Messages</h3>
      <p className="text-text-secondary">Select a chat to start messaging...</p>
    </div>
  );
};

export default EmptyConversation;
