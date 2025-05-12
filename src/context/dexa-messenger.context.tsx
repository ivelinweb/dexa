"use client";

import {
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import DexaMessenger from "@/contracts/DexaMessenger.sol/DexaMessenger.json";
import { DEXA_MESSENGER } from "@/config/env";
import { toOxString } from "@/libs/helpers";
import { useWatchContractEvent, useAccount, useReadContract } from "wagmi";
import { FriendListInterface } from "@/interfaces/user.interface";
import {
  ChatInterface,
  MessageInterface,
  RequestInterface,
} from "@/interfaces/message.interface";
import { ethers, concat } from "ethers";

const MESSENGER = toOxString(DEXA_MESSENGER);

export type DexaMessengerType = {
  connections: FriendListInterface[];
  requests: RequestInterface[];
  messages: ChatInterface[];
  setMessages: React.Dispatch<SetStateAction<ChatInterface[]>>;
  MessengerABI: any;
  dexaMessenger: `0x${string}`;
  currentMsg?: ChatInterface;
  setCurrentMsg: React.Dispatch<SetStateAction<ChatInterface | undefined>>;
  mapChats: (value: ChatInterface) => ChatInterface;
  mapMessages: (value: MessageInterface[]) => MessageInterface[];
  getChatCode: (addressFrom: string, addressTo: string) => string;
  isMsgBoxOn: boolean;
  setIsMsgBoxOn: React.Dispatch<SetStateAction<boolean>>;
};

interface Props {
  children: React.ReactNode;
}

export const DexaMessengerContext = createContext<
  DexaMessengerType | undefined
>(undefined);

export function DexaMessengerProvider({ children }: Props) {
  const { address, isConnected } = useAccount();
  const [friends, setFriends] = useState<FriendListInterface[]>([]);
  const [requests, setRequest] = useState<RequestInterface[]>([]);
  const [MessengerABI] = useState(DexaMessenger);
  const [dexaMessenger] = useState<`0x${string}`>(MESSENGER);
  const [messages, setMessages] = useState<ChatInterface[]>([]);
  const [currentMsg, setCurrentMsg] = useState<ChatInterface>();
  const [isMsgBoxOn, setIsMsgBoxOn] = useState<boolean>(false);

  const { data: msgList } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "getAllChats",
    account: address,
    args: [],
    query: { enabled: isConnected },
  });

  const { data: connections } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "getFriendsList",
    account: address,
    args: [],
    query: { enabled: isConnected },
  });

  const { data: req } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "getConnectRequests",
    account: address,
    args: [],
    query: { enabled: isConnected },
  });

  useEffect(() => {
    if (msgList) {
      const list = msgList as ChatInterface[];
      const mappedList = list.map((value) => mapChats(value));
      setMessages(mappedList);
    }
  }, [msgList]);

  useEffect(() => {
    if (connections) {
      setFriends(connections as FriendListInterface[]);
    }
  }, [connections]);

  useEffect(() => {
    if (req) {
      setRequest(req as RequestInterface[]);
    }
  }, [req]);

  const mapChats = ({ profile, chats }: ChatInterface) => {
    return {
      profile,
      chats: mapMessages(chats),
    } as ChatInterface;
  };

  const mapMessages = (chats: MessageInterface[]) => {
    return chats.map(({ createdAt, ...data }) => ({
      createdAt: `${new Date(Number(createdAt) * 1000)}`,
      ...data,
    })) as MessageInterface[];
  };

  const getChatCode = (addressFrom: string, addressTo: string) => {
    let encodePacked;
    if (addressFrom < addressTo) {
      encodePacked = ethers.concat([addressFrom, addressTo]);
      return ethers.keccak256(encodePacked);
    } else {
      encodePacked = ethers.concat([addressTo, addressFrom]);
      return ethers.keccak256(encodePacked);
    }
  };

  return (
    <DexaMessengerContext.Provider
      value={{
        connections: friends,
        requests,
        messages,
        setMessages,
        MessengerABI,
        dexaMessenger,
        currentMsg,
        setCurrentMsg,
        mapChats,
        mapMessages,
        getChatCode,
        isMsgBoxOn,
        setIsMsgBoxOn
      }}
    >
      {children}
    </DexaMessengerContext.Provider>
  );
}

export function useDexaMessenger() {
  const context = useContext(DexaMessengerContext);
  if (context === undefined) {
    throw new Error(
      "useDexaMessenger must be used within a DexaMessengerProvider"
    );
  }
  return context;
}
