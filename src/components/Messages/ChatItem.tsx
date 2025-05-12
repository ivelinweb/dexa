import React from "react";
import { useAccount } from "wagmi";
import { MessageInterface } from "@/interfaces/message.interface";
import Moment from "react-moment";
import ChatMedia from "./ChatMedia";

type Props = {
  chat: MessageInterface;
};

function ChatItem({ chat }: Props) {
  const { address } = useAccount();
  const isOwnerMsg = chat.sender == address;

  return (
    <div
      className={`flex flex-col my-5 ${
        isOwnerMsg ? "justify-end items-end" : "items-start"
      }`}
    >
      {chat.media.length > 0 && <ChatMedia chat={chat} />}
      <div
        className={`relative space-x-2 px-3 py-2 max-w-xs rounded-2xl ${
          isOwnerMsg
            ? "rounded-br-xl bg-primary text-white"
            : "rounded-bl-xl bg-primary/20"
        }`}
      >
        <p className="inline">{chat.message}</p>
        <sub className="inline">
          <Moment
            format="h:mm A"
            className={`text-[.6rem] ${
              isOwnerMsg ? "order-last pr-1 text-white/60" : "text-medium"
            }`}
          >
            {chat.createdAt}
          </Moment>
        </sub>
        <div
          className={`absolute w-0 -bottom-[1.14rem] h-0 border-t-[8px] ${
            isOwnerMsg
              ? "right-3 border-t-primary"
              : "left-1 border-t-primary/20 z-0"
          } border-r-[10px] border-r-transparent border-l-[10px] border-l-transparent border-b-[10px] border-b-transparent`}
        ></div>
      </div>
    </div>
  );
}

export default ChatItem;
