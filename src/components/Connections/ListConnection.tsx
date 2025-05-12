"use client";
import React, { useEffect } from "react";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import { FriendListInterface } from "@/interfaces/user.interface";
import Link from "next/link";
import { formatWalletAddress } from "@/libs/helpers";
import Button from "../Form/Button";
import { EllipsisVertical } from "lucide-react";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import { ChatInterface } from "@/interfaces/message.interface";
import { useRouter } from "next/navigation";
import { routes } from "@/libs/routes";
type Props = {
  connection: FriendListInterface;
};
function ListConnection({ connection }: Props) {
  const router = useRouter();
  const { setMessages, messages } = useDexaMessenger();

  useEffect(() => {
    router.prefetch(routes.app.messages.index);
  }, [router]);

  const initChat = () => {
    const isMessage = messages.find((m) => m.profile.id == connection.id);
    if (!isMessage) {
      setMessages((prev) => {
        const temp = [...prev];
        const newChat: ChatInterface = {
          profile: connection,
          chats: [],
        };
        temp.push(newChat);
        return temp;
      });
    }
    router.push(routes.app.messages.message(connection.id));
  };

  const remove = async () => {};

  return (
    <div className="flex items-center justify-between py-4 px-5 hover:bg-light cursor-pointer">
      <div className="flex items-center gap-x-2">
        <CreatorPFP
          username={connection?.username}
          name={connection?.name}
          pfp={connection?.pfp}
        />
        <div className="text-sm">
          <div className="gap-x-2 flex items-center">
            <Link
              href={routes.app.profile(connection.username)}
              className="font-semibold"
            >
              {connection?.name}
            </Link>
            <span className="text-medium">@{connection?.username}</span>
          </div>
          <p className="text-dark">
            You are connect with{" "}
            <span className="text-primary">@{connection.username}</span>
          </p>
          {connection.id && (
            <p className="text-medium">
              Profile ID:{" "}
              <span className="text-primary font-medium">
                {formatWalletAddress(connection.id)}
              </span>
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-x-3">
        <Button
          onClick={initChat}
          type={"button"}
          kind={"clear"}
          shape={"ROUNDED"}
          size={"SMALL"}
          className="bg-primary text-white hover:bg-primary/80 border border-primary"
        >
          Message
        </Button>
        <Button
          type={"button"}
          kind={"default"}
          shape={"CIRCLE"}
          className="hover:bg-primary/20 hover:text-primary"
          hoverColor={false}
          title="More"
        >
          <EllipsisVertical size={18} />
        </Button>
      </div>
    </div>
  );
}

export default ListConnection;
