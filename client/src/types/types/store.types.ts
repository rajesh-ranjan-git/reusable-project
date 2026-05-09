import { Dispatch, SetStateAction } from "react";
import { ThemeType } from "@/types/types/common.types";
import { LoggedInUserType } from "@/types/types/auth.types";
import { ConversationDisplayType } from "@/types/types/conversation.types";
import { MessageResponseType } from "@/types/types/message.types";
import { CurrentFormType } from "@/types/types/profile.types";
import { ResponsePaginationType } from "@/types/types/response.types";

export type AppStateType = {
  activeTheme: ThemeType;
  setActiveTheme: Dispatch<SetStateAction<ThemeType>>;
  accessToken: string | null;
  setAccessToken: Dispatch<SetStateAction<string | null>>;
  loggedInUser: LoggedInUserType;
  setLoggedInUser: Dispatch<SetStateAction<LoggedInUserType>>;
  isLoggingOut: boolean;
  setIsLoggingOut: Dispatch<SetStateAction<boolean>>;
  currentProfileForm: CurrentFormType;
  setCurrentProfileForm: Dispatch<SetStateAction<CurrentFormType>>;
  conversationList: ConversationDisplayType[];
  setConversationList: Dispatch<SetStateAction<ConversationDisplayType[]>>;
  conversationListPagination: ResponsePaginationType | null;
  setConversationListPagination: Dispatch<
    SetStateAction<ResponsePaginationType | null>
  >;
  onlineUserIds: string[] | null;
  setOnlineUserIds: Dispatch<SetStateAction<string[] | null>>;
  resetConversationUnread: (conversationId: string) => void;
  updateConversationWithMessage: (
    message: MessageResponseType,
    options?: {
      activeConversationId?: string | null;
      incrementUnread?: boolean;
    },
  ) => void;
  clearSessionState: () => void;
};
