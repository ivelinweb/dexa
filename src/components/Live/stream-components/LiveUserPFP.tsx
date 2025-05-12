"use client";
import React, { useEffect } from "react";
import Image from "next/image";
import { FriendListInterface } from "@/interfaces/user.interface";
import {
  encryptMessage,
  getFirstLetters,
  stringToColor,
  walletToLowercase,
} from "@/libs/helpers";
import { useRouter } from "next/navigation";
import { routes } from "@/libs/routes";

type Props = {
  user: FriendListInterface;
};

function LiveUserPFP({ user }: Props) {
  const router = useRouter();
  const color = stringToColor(`${user.name}`);
  const wallet = walletToLowercase(`${user?.id}`);
  const encrypted = encryptMessage(wallet);

  useEffect(() => {
    router.prefetch(routes.app.watch(`${encodeURIComponent(encrypted)}`));
  }, []);

  const liveStream = () => {
    router.push(routes.app.watch(`${encodeURIComponent(encrypted)}`));
  };

  return (
    <div
      onClick={liveStream}
      role="button"
      className="h-10 w-10 rounded-full border-2 flex items-center justify-center"
      style={{ borderColor: color }}
    >
      <div className="w-[2.0rem] h-[2.0rem] rounded-full">
        {user.pfp ? (
          <Image
            src={user.pfp}
            height={400}
            width={400}
            alt={"PFP"}
            placeholder="blur"
            blurDataURL="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
            className="h-10 w-10 rounded-full"
            priority={true}
          />
        ) : (
          <div className="w-[2.0rem] h-[2.0rem] bg-light rounded-full flex justify-center items-center">
            <p className="text-base font-semibold" style={{ color }}>
              {getFirstLetters(`${user.name}`)}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LiveUserPFP;
