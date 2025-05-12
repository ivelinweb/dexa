"use client";

import React, { useMemo } from "react";
import {
  useChat,
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { SendHorizonalIcon, SmilePlusIcon } from "lucide-react";
import Button from "@/components/Form/Button";
import Chats from "./Chats";
import Header from "@/components/ui/Header";
import { chatResolver } from "@/schemas/chat.schema";

type Props = {
  hostIdentity: string;
  hostName: string;
  isStreaming: boolean;
  className?: string;
};

function ChatContainer({ hostIdentity }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm(chatResolver);
  const connState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const { chatMessages, send } = useChat();
  const messages = useMemo(() => {
    return chatMessages.sort((a, b) => b.timestamp - a.timestamp);
  }, [chatMessages]);

  const isOnline = participant && connState === ConnectionState.Connected;
  const isHidden = !isOnline;

  const onSubmit = (data: FieldValues) => {
    if (!send || isHidden) return;
    send(data.message);
    reset();
  };

  return (
    <div className="flex-1 flex flex-col justify-between">
      <div className="py-1 pl-3 border-b border-light">
        <Header title="Live Chat" isBack={false} />
      </div>
      <div className="px-5 flex flex-1 overflow-hidden">
        <Chats messages={messages} isHidden={isHidden} />
      </div>
      <footer className="min-h-[5rem] max-h-20 h-[5rem] bg-white border-light dark:bg-gray-800 border-t dark:border-gray-600 flex space-x-2 items-center px-4">
        <Controller
          control={control}
          render={({ field: { onChange, value } }) => (
            <div className="rounded-3xl flex-1 overflow-hidden dark:bg-gray-900 flex bg-light">
              <Button disabled={isHidden} type={"button"} kind={"clear"}>
                <SmilePlusIcon size={14} />
              </Button>
              <textarea
                disabled={isHidden}
                onChange={onChange}
                value={value}
                className="w-full outline-none h-12 bg-transparent py-3 text-medium"
                placeholder="Type a message..."
              ></textarea>
            </div>
          )}
          name="message"
          defaultValue=""
        />

        <Button
          type={"button"}
          kind={"primary"}
          shape={"CIRCLE"}
          onClick={handleSubmit(onSubmit)}
          disabled={isSubmitting || isHidden}
        >
          <SendHorizonalIcon size={14} />
        </Button>
      </footer>
    </div>
  );
}

export default ChatContainer;
