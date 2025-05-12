"use client";

import React, { useEffect, useState } from "react";
import {
  BadgeCheckIcon,
  BellIcon,
  Calendar,
  Camera,
  HandCoinsIcon,
  LinkIcon,
  MessageSquareShare,
  WalletIcon,
} from "lucide-react";
import Button from "../Form/Button";
import ShowMore from "../Posts/ShowMore";
import Link from "next/link";
import BackButton from "../ui/BackButton";
import { useReadContract, useAccount, useReadContracts } from "wagmi";
import {
  decryptMessage,
  encryptMessage,
  formatWalletAddress,
  getFirstLetters,
  toOxString,
  walletToLowercase,
} from "@/libs/helpers";
import {
  FriendListInterface,
  UserInterface,
} from "@/interfaces/user.interface";
import Moment from "react-moment";
import { useAuth } from "@/context/auth.context";
import EditProfile from "./EditProfile";
import { useDexa } from "@/context/dexa.context";
import Image from "next/image";
import ConnectButton from "./ConnectButton";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import { ChatInterface } from "@/interfaces/message.interface";
import { useRouter, useSearchParams } from "next/navigation";
import { routes } from "@/libs/routes";
import { getUserStreamStatus } from "@/actions/stream.action";

export type Status = {
  isRequest: boolean;
  isAccepted: boolean;
};

function ProfileHeader() {
  const searchParams = useSearchParams();
  const username = searchParams.get("u");
  const { address } = useAccount();
  const router = useRouter();
  const [user, setUser] = useState<UserInterface>();
  const [isLive, setIsLive] = useState<boolean>(false);
  const [connections, setConnections] = useState<FriendListInterface[]>([]);
  const [editModal, setEditModal] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>();
  const { user: authUser } = useAuth();
  const { messages, setMessages } = useDexaMessenger();
  const { dexaCreator, CreatorABI, MessengerABI, dexaMessenger } = useDexa();
  const isOwner =
    user?.wallet?.toLowerCase() == authUser?.wallet?.toLowerCase();

  const { data: response } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "findCreatorByUsername",
    args: [`${username}`],
  });

  const { data: isFriend } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "checkFriendStatus",
    args: [`${username}`],
    account: address,
  });

  const { data: friends } = useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName: "getFriendsList",
    account: toOxString(`${user?.wallet}`),
    query: { enabled: user?.wallet ? true : false },
  });

  useEffect(() => {
    if (!user) return;
    const wallet = walletToLowercase(`${user?.wallet}`);
    const encrypted = encryptMessage(wallet);
    router.prefetch(routes.app.messages.message(`${user?.wallet}`));
    router.prefetch(routes.app.watch(`${encodeURIComponent(encrypted)}`));
  }, [user, router]);

  useEffect(() => {
    if (friends) {
      setConnections(friends as FriendListInterface[]);
    }
  }, [friends]);

  useEffect(() => {
    if (isFriend) {
      const data = isFriend as boolean[];
      setStatus({ isRequest: data[0], isAccepted: data[1] });
    }
  }, [isFriend]);

  useEffect(() => {
    if (response) {
      const { createdAt, ...payload } = response as UserInterface;
      const date = new Date(Number(createdAt) * 1000).toISOString();
      setUser({ ...payload, createdAt: date });
    }
  }, [response]);

  useEffect(() => {
    const checkStatus = async () => {
      const user = response as UserInterface;
      const statusRes = await getUserStreamStatus(`${user.wallet}`);
      setIsLive(statusRes.status ? statusRes.data.status : false);
    };
    if (response) checkStatus();
  }, [response]);

  const initChat = () => {
    const isMessage = messages.find((m) => m.profile.id == user?.wallet);
    if (!isMessage && user) {
      setMessages((prev) => {
        const temp = [...prev];
        const newChat: ChatInterface = {
          profile: {
            id: `${user.wallet}`,
            name: `${user.name}`,
            username: `${user.username}`,
            pfp: `${user.pfp}`,
          },
          chats: [],
        };
        temp.push(newChat);
        return temp;
      });
    }
    router.push(routes.app.messages.message(`${user?.wallet}`));
  };

  const liveStream = () => {
    const wallet = walletToLowercase(`${user?.wallet}`);
    const encrypted = encryptMessage(wallet);
    router.push(routes.app.watch(`${encodeURIComponent(encrypted)}`));
  };

  return (
    <>
      <div className="py-3 px-2 bg-white xl:bg-white/95 sticky z-50 top-0">
        <div className="flex items-center justify-start space-x-2">
          <BackButton />
          <div>
            <p className="text-xl font-semibold">{user?.name}</p>
            {user && user.wallet && (
              <p className="text-xs text-medium">
                {formatWalletAddress(user.wallet)}
              </p>
            )}
          </div>
        </div>
      </div>
      <div className="bg-white relative">
        <div className="mx-auto">
          <div className={`h-48 md:h-52 relative w-full`}>
            <div className="h-full w-full overflow-hidden bg-light">
              {user?.banner ? (
                <Image
                  src={user.banner}
                  height={2500}
                  width={3000}
                  alt={"Banner"}
                  className={`w-full h-full m-0 flex`}
                />
              ) : (
                <>
                  <img
                    src={"/banner/bg.png"}
                    className={`w-full h-full m-0 flex`}
                  />
                  <div className="h-full w-full absolute bg-white/10 inset-0"></div>
                </>
              )}
              <div
                className={`h-32 w-32 overflow-hidden rounded-full hover:bg-medium/25 hover:cursor-pointer flex items-center justify-center border-4 ${
                  isLive ? "border-primary" : "border-white"
                } absolute -bottom-16 left-4 bg-medium/20`}
              >
                {isLive && (
                  <div
                    role="button"
                    onClick={liveStream}
                    className="absolute inset-0 z-50 flex items-center justify-center bg-dark/10"
                  >
                    <p className="text-xs bg-primary px-2 py-1 rounded-sm animate-pulse text-white">
                      LIVE
                    </p>
                  </div>
                )}
                {user?.pfp ? (
                  <Image
                    src={user.pfp}
                    height={400}
                    width={400}
                    alt={"PFP"}
                    className=""
                  />
                ) : isOwner ? (
                  <div
                    role="button"
                    onClick={() => setEditModal(true)}
                    className="h-14 w-14 cursor-pointer bg-white/90 border border-primary rounded-full flex justify-center items-center"
                  >
                    <Camera className="text-primary" />
                  </div>
                ) : (
                  <div className="h-14 w-14 bg-white/90 border border-primary rounded-full flex justify-center items-center">
                    <p className="text-2xl font-semibold text-primary">
                      {getFirstLetters(`${user?.name}`)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isOwner ? (
            <div className="flex justify-end py-3 px-5 gap-x-2">
              <Button
                type="button"
                kind={"default"}
                shape={"ROUNDED"}
                onClick={() => setEditModal(true)}
                className="border border-medium text-sm"
              >
                Edit profile
              </Button>
            </div>
          ) : (
            <div className="flex justify-end py-3 px-5 gap-x-2">
              <Button
                type="button"
                kind={"default"}
                shape={"CIRCLE"}
                className="border border-medium text-sm"
              >
                <BellIcon size={18} />
              </Button>
              <Button
                type="button"
                kind={"default"}
                shape={"CIRCLE"}
                className="border border-medium text-sm"
              >
                <HandCoinsIcon size={18} />
              </Button>
              {status && !status.isAccepted ? (
                <ConnectButton to={`${user?.wallet}`} status={status} />
              ) : (
                <Button
                  onClick={initChat}
                  type="button"
                  kind={"primary"}
                  shape={"ROUNDED"}
                  className="text-sm"
                >
                  <div className="flex items-center gap-x-2">
                    <p>Message</p>
                    <MessageSquareShare size={18} />
                  </div>
                </Button>
              )}
            </div>
          )}
          <div className="md:flex px-5 items-center justify-between">
            <div className="">
              <div>
                <div className="flex items-center space-x-1">
                  <div className="max-w-sm truncate">
                    <p className="font-bold text-lg">{user?.name}</p>
                  </div>
                  <BadgeCheckIcon
                    size={25}
                    className="fill-primary stroke-white"
                  />
                </div>
                <p className="text-primary -mt-1 text-sm font-normal truncate max-w-[10rem]">
                  @{user?.username}
                </p>
              </div>
              {user?.bio && (
                <div className="mt-1">
                  <ShowMore data={user.bio} isShowMore={true}></ShowMore>
                </div>
              )}

              <div className="mt-3 flex items-center gap-x-3 flex-wrap">
                {user && user.wallet && (
                  <Link
                    href=""
                    target={"_blank"}
                    className="flex items-center space-x-1"
                  >
                    <WalletIcon size={18} className="text-medium" />
                    <p className="text-primary text-sm">
                      {formatWalletAddress(user.wallet)}
                    </p>
                  </Link>
                )}
                {user?.website && (
                  <Link
                    href={user.website}
                    target={"_blank"}
                    className="flex items-center space-x-1"
                  >
                    <LinkIcon size={18} className="text-medium" />
                    <p className="text-primary text-sm">{user.website}</p>
                  </Link>
                )}

                <div className="flex items-center space-x-1">
                  <Calendar size={18} className="text-medium" />
                  <p className="text-medium text-sm">
                    Joined{" "}
                    <Moment format="MMM D, YYYY">{user?.createdAt}</Moment>
                  </p>
                </div>
              </div>
              <div className="flex items-center mt-3">
                <div className="flex items-center space-x-1">
                  <p className="font-extrabold text-sm text-dark">
                    {connections.length}
                  </p>
                  <p className="text-medium text-sm">
                    Connection{connections.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {user && isOwner && (
        <EditProfile user={user} isOpen={editModal} setIsOpen={setEditModal} />
      )}
    </>
  );
}

export default ProfileHeader;
