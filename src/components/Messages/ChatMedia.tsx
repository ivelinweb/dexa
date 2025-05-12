import { MediaType } from "@/interfaces/feed.interface";
import { MessageInterface } from "@/interfaces/message.interface";
import Image from "next/image";
import React from "react";
import { useAccount } from "wagmi";

type Props = {
  chat: MessageInterface;
};

function ChatMedia({ chat }: Props) {
  const { address } = useAccount();
  const isOwnerMsg = chat.sender == address;

  const Single = () => (
    <div className={`mb-1`}>
      <div className="flex flex-col shrink-0 gap-1">
        {chat.media.map((media, i) => (
          <div
            key={i}
            className={`flex-1 flex items-center justify-center max-w-[16rem] rounded-xl overflow-hidden border-4 ${
              isOwnerMsg
                ? "border-primary bg-primary"
                : "border-primary/20 bg-primary/20"
            }`}
          >
            <Image
              src={media.url}
              height={500}
              width={500}
              alt={`${i}`}
              className="h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const Triple = () => <div>Triple</div>;

  const Quad = () => <div>Quad</div>;

  return (
    <div>
      {chat.media.length <= 2 && <Single />}
      {chat.media.length == 3 && <Triple />}
      {chat.media.length >= 4 && <Quad />}
    </div>
  );
}

export default ChatMedia;
