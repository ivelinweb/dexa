import React, { useEffect, useState } from "react";
import Moment from "react-moment";

import { FriendListInterface } from "@/interfaces/user.interface";
import { MessageInterface } from "@/interfaces/message.interface";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import { useAccount, useReadContract } from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { useRouter } from "next/navigation";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import { routes } from "@/libs/routes";

type Props = { contact: FriendListInterface; messages: MessageInterface[] };

const FriendList = ({ contact, messages }: Props) => {
  const router = useRouter();

  const { address } = useAccount();
  const [lastMsg, setLastMsg] = useState<MessageInterface>();
  const { setCurrentMsg, mapMessages, setIsMsgBoxOn } = useDexaMessenger();
  const { MessengerABI, dexaMessenger } = useDexa();
  const { data: message } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "readChat",
    args: [contact.id],
    account: address,
  });

  useEffect(() => {
    router.prefetch(routes.app.messages.message(contact.id));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const msgs = messages as MessageInterface[];
      const sortedMsg = sortMsg(msgs);
      setLastMsg(sortedMsg[0]);
    }
  }, [messages]);

  useEffect(() => {
    if (message) {
      const msgs = message as MessageInterface[];
      const sortedMsg = sortMsg(mapMessages(msgs));
      setLastMsg(sortedMsg[0]);
    }
  }, [message]);

  const sortMsg = (msgs: MessageInterface[]) => {
    return msgs.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const initChat = () => {
    setIsMsgBoxOn(true);
    setCurrentMsg({ profile: contact, chats: messages });
    router.push(routes.app.messages.message(contact.id));
  };

  return (
    <div
      className="flex justify-between space-x-2 lg:space-x-0"
      onClick={initChat}
    >
      <div className="flex truncate w-full md:w-[12rem] lg:w-[18rem] items-center space-x-2">
        <CreatorPFP
          username={contact?.username}
          name={contact?.name}
          pfp={contact?.pfp}
        />
        <div className="w-auto flex-1 truncate">
          <div>
            <h1 className="truncate font-semibold text-dark">
              {contact?.name}
            </h1>
          </div>
          <p className="truncate text-sm text-medium">{lastMsg?.message}</p>
        </div>
      </div>
      <div className="w-[6rem] md:w-[4rem] text-medium flex items-center justify-end text-right">
        <div className="">
          <Moment
            format="h:mm A"
            className={`text-xs text-medium block truncate`}
          >
            {lastMsg?.createdAt}
          </Moment>
        </div>
      </div>
    </div>
  );
};

export default FriendList;
