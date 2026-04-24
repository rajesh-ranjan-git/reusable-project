export type ChatType = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
};

export type MessageType = {
  id: number;
  text: string;
  time: string;
  isOwn: boolean;
};
