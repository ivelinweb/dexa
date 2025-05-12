"use client";

import React, { SetStateAction, useState, useRef, useEffect } from "react";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import {
  ChatInterface,
  MessageInterface,
} from "@/interfaces/message.interface";
import { useAccount, useWriteContract } from "wagmi";
import Button from "../Form/Button";
import {
  ImageIcon,
  PaperclipIcon,
  SendHorizonalIcon,
  SmilePlusIcon,
} from "lucide-react";
import CLEditor from "../Editor/Editor";
import PreviewMedia from "./PreviewMedia";
import FileSelector from "../ui/FileSelector";
import { uploadMsgMedia } from "@/actions/message.action";

type Props = {
  endOfMsgRef: React.RefObject<HTMLParagraphElement>;
  setChats: React.Dispatch<SetStateAction<ChatInterface | undefined>>;
  chats: ChatInterface | undefined;
};

const SendMessage = ({ endOfMsgRef, setChats, chats }: Props) => {
  const { address } = useAccount();
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [msg, setMsg] = useState<string>();
  const [files, setFiles] = useState<File[]>([]);
  const mediaRef = useRef<HTMLInputElement>(null);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const { currentMsg, setCurrentMsg, dexaMessenger, MessengerABI } =
    useDexaMessenger();
  const { writeContractAsync } = useWriteContract();

  useEffect(() => {
    if (files && files.length > 0) {
      setIsPreview(true);
    }
  }, [files]);

  const scrollToBottom = (prop: any) => {
    if (endOfMsgRef.current) endOfMsgRef.current.scrollIntoView(prop);
  };

  const initSendMessage = async () => {
    if (!msg || !address || !currentMsg || msg == "") return;
    let media = [];
    setIsDisabled(true);
    if (files.length > 0) {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      const res = await uploadMsgMedia(formData);
      media = res.data;
    }
    await writeContractAsync({
      abi: MessengerABI,
      address: dexaMessenger,
      functionName: "sendMessage",
      args: [`${currentMsg?.profile.id}`, msg, media],
    });
    const chat: MessageInterface = {
      sender: address,
      message: msg,
      media,
      createdAt: new Date().toISOString(),
    };
    setCurrentMsg({
      profile: currentMsg.profile,
      chats: [...currentMsg.chats, chat],
    });
    setMsg("");
    setIsPreview(false);
    setFiles([]);
    setIsDisabled(false);
    scrollToBottom({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <form>
        <footer className="min-h-[5rem] max-h-20 bg-white md:bg-primary/10 border-light dark:bg-gray-800 border-t dark:border-gray-600 flex space-x-2 items-center px-4">
          <div className="rounded-3xl flex-1 overflow-hidden dark:bg-gray-900 flex bg-white">
            <Button type={"button"} kind={"clear"}>
              <SmilePlusIcon size={14} />
            </Button>
            <textarea
              onChange={(e) => setMsg(e.currentTarget.value)}
              className="w-full outline-none h-12 bg-transparent py-3 text-medium"
              placeholder="Type a message..."
              value={msg}
            ></textarea>
            <>
              <FileSelector
                onSelect={(ev) => {
                  if (ev.target.files) {
                    const file = ev.target.files;
                    const array = Array.from(file);
                    setFiles(array);
                    // setValue("images", file);
                    // onChange(file);
                  }
                }}
                ref={mediaRef}
                accept="image/png, image/jpeg"
                multiple={true}
              />
              <Button
                type={"button"}
                kind={"clear"}
                onClick={() => mediaRef.current?.click()}
              >
                <ImageIcon size={14} />
              </Button>
            </>
          </div>

          <Button
            type={"button"}
            kind={"primary"}
            shape={"CIRCLE"}
            onClick={initSendMessage}
            disabled={isDisabled}
          >
            <SendHorizonalIcon size={14} />
          </Button>
        </footer>
        <PreviewMedia
          isOpen={isPreview}
          setIsOpen={setIsPreview}
          files={files}
          setFiles={setFiles}
          msg={msg}
          setMsg={setMsg}
          onSubmit={initSendMessage}
          isDisabled={isDisabled}
        />
      </form>
    </>
  );
};

export default SendMessage;
