"use client";

import React from "react";
import { Chat, ReceivedChatMessage } from "@livekit/components-react";
import ChatItem from "./ChatItem";

type Props = {
  messages: ReceivedChatMessage[];
  isHidden: boolean;
};

function Chats({ messages, isHidden }: Props) {
  if (isHidden || !messages || messages.length == 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-medium">
          {isHidden ? "Chat is disabled" : "Welcome to the chat!"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col-reverse overflow-scroll scrollbar-hide">
      {messages.map((msg, id) => (
        <ChatItem key={id} msg={msg} />
      ))}
    </div>
  );
}

export default Chats;
