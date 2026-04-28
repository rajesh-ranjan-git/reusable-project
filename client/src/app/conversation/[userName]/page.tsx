import { ConversationProps } from "@/types/props/conversation.props";
import ConversationPage from "@/components/pages/conversation/conversation.page";

const SingleConversation = async ({ params }: ConversationProps) => {
  const { userName } = await params;

  return <ConversationPage userName={userName} />;
};

export default SingleConversation;
