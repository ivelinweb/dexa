"use client";
import React, { useEffect } from "react";
import Button from "../Form/Button";
import { BellIcon, BoxIcon, HomeIcon, MailIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import { useAuth } from "@/context/auth.context";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import { routes } from "@/libs/routes";

function MobileMenu() {
  const router = useRouter();
  const { setIsMsgBoxOn, isMsgBoxOn } = useDexaMessenger();
  const { user } = useAuth();

  useEffect(() => {
    router.prefetch(routes.app.messages.index);
    router.prefetch(routes.app.home);
    router.prefetch("/messages");
    router.prefetch("/messages");
    router.prefetch("/messages");
  }, []);

  const navigateTo = (url: string) => {
    router.push(url);
  };

  return (
    <div
      className={`h-14 xs:hidden bg-white/80 shadow-sm border-t border-light w-full ${
        isMsgBoxOn && "hidden"
      }`}
    >
      <div className="px-5 flex items-center h-full justify-between">
        <Button
          onClick={() => navigateTo(routes.app.home)}
          type={"button"}
          kind={"default"}
          shape={"CIRCLE"}
          className="bg-transparent"
          hoverColor={false}
        >
          <HomeIcon height={23} />
        </Button>
        <Button
          onClick={() => {
            navigateTo(routes.app.messages.index);
            setIsMsgBoxOn(false);
          }}
          type={"button"}
          kind={"default"}
          shape={"CIRCLE"}
          className="bg-transparent"
          hoverColor={false}
        >
          <MailIcon height={23} />
        </Button>
        <Button
          type={"button"}
          kind={"default"}
          shape={"CIRCLE"}
          className="bg-transparent"
          hoverColor={false}
        >
          <BoxIcon height={23} />
        </Button>
        <Button
          type={"button"}
          kind={"default"}
          shape={"CIRCLE"}
          className="bg-transparent"
          hoverColor={false}
        >
          <BellIcon height={23} />
        </Button>
        <CreatorPFP
          username={user?.username}
          name={user?.name}
          pfp={user?.pfp}
        />
      </div>
    </div>
  );
}

export default MobileMenu;
