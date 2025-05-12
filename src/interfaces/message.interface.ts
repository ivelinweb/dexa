import { MediaType } from "./feed.interface";
import { FriendListInterface } from "./user.interface";

export interface RequestInterface {
  sender: string;
  createdAt: string;
}
export interface MessageInterface {
  sender: string;
  message: string;
  media: MediaType[];
  createdAt: string;
}

export interface ChatInterface {
  profile: FriendListInterface;
  chats: MessageInterface[];
}
