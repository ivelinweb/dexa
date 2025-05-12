"use client";

import {
  BanknoteIcon,
  BellDotIcon,
  BookmarkIcon,
  BoxIcon,
  CandlestickChart,
  EllipsisIcon,
  HomeIcon,
  LogOutIcon,
  MailIcon,
  PodcastIcon,
  Rows3Icon,
  SettingsIcon,
  Users2Icon,
  UsersIcon,
  Wallet2Icon,
} from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Button from "../Form/Button";
import { favicon } from "../Icons/Connector";
import MintPostModal from "../Posts/MintPostModal";
import { useAuth } from "@/context/auth.context";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import * as Popover from "@radix-ui/react-popover";
import { getFirstLetters } from "@/libs/helpers";
import { routes } from "@/libs/routes";
import { useAppSelector } from "@/hooks/redux.hook";
import { selectSidebar } from "@/slices/sidebar/sidebar.slice";

export default function Sidebar() {
  const path = usePathname();
  const [mintModal, setMintModal] = useState<boolean>(false);
  const { user, logout } = useAuth();

  const navigation = [
    { name: "Home", href: routes.app.home, icon: HomeIcon },
    {
      name: "Explore",
      href: routes.app.explore,
      icon: BoxIcon,
    },
    {
      name: "Messages",
      href: routes.app.messages.index,
      icon: MailIcon,
    },
    // {
    //   name: "Notifications",
    //   href: "/notifications",
    //   icon: BellDotIcon,
    // },
    {
      name: "Bookmarks",
      href: routes.app.bookmarks,
      icon: BookmarkIcon,
    },
    {
      name: "Connections",
      href: routes.app.connections,
      icon: Users2Icon,
    },
    // {
    //   name: "My Collections",
    //   href: "/collections",
    //   icon: Rows3Icon,
    // },
    // {
    //   name: "Stats",
    //   href: "/stats",
    //   icon: CandlestickChart,
    // },

    {
      name: "Community",
      href: routes.app.community,
      icon: UsersIcon,
    },
    {
      name: "Settings",
      href: routes.app.settings,
      icon: SettingsIcon,
    },
    {
      name: "Wallet",
      href: routes.app.wallet.index,
      icon: Wallet2Icon,
    },
  ];

  // const checkIsActive = (pathname: string, isActive?: Array<string>) => {
  //   const splitPath = pathname.split("/");
  //   const basePath = splitPath[1];
  //   return isActive?.includes(basePath);
  // };
  const isActive = (url: string) => path.includes(url);

  return (
    <>
      <div className="border-r border-light h-screen flex flex-col justify-between">
        <div>
          <div className="px-3 pt-3 pb-5 flex xl:justify-start justify-end">
            <Image
              src={favicon.main}
              width={260}
              height={260}
              alt={`dexa`}
              className="h-12 w-12"
              priority={true}
            />
          </div>
          <div>
            {navigation.map((nav, idx) => (
              <Link
                prefetch={true}
                href={nav.href}
                key={idx}
                className="flex justify-end xl:justify-start group px-3 md:pl-5 md:pr-5 xl:pl-0 xl:pr-0"
              >
                <div
                  className={`flex space-x-2 group-hover:bg-primary/10 transition-all duration-200 rounded-[1.8rem] p-[0.8rem] xl:py-[0.8rem] xl:pl-3 xl:pr-8`}
                >
                  <nav.icon
                    className={`group-hover:text-primary ${
                      isActive(nav.href) ? "text-primary" : ""
                    }`}
                    size={26}
                  />
                  <p
                    className={`hidden xl:inline group-hover:text-primary text-lg ${
                      isActive(nav.href) ? "text-primary font-bold" : ""
                    }`}
                  >
                    {nav.name}
                  </p>
                </div>
              </Link>
            ))}
            <div
              onClick={() => setMintModal(true)}
              role={"button"}
              className="flex justify-end xl:justify-start mt-5 group px-3 md:pr-5 cursor-pointer"
            >
              <div className="flex xl:flex-1 xl:space-x-2 justify-center bg-primary text-white group-hover:bg-primary/90 transition-all duration-200 rounded-[1.8rem] p-[0.8rem]">
                <p className="text-center font-bold text-lg hidden xl:inline">
                  Mint
                </p>
                <PodcastIcon size={26} />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-2 px-3">
          <Popover.Root>
            <Popover.Trigger className="w-full">
              <div className="outline-none flex justify-end xl:justify-start w-full">
                <div className="py-3 px-3 rounded-full  hover:bg-light cursor-pointer flex items-center justify-end xl:justify-between w-auto xl:w-full">
                  <div className="flex justify-end items-center gap-2">
                    <div className="w-10">
                      <div className="hover:bg-dark/20 cursor-pointer h-10 w-10 rounded-full absolute"></div>
                      {user?.pfp ? (
                        <Image
                          src={user.pfp}
                          height={400}
                          width={400}
                          alt={"PFP"}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-white/90 border border-primary rounded-full flex justify-center items-center">
                          <p className="text-base font-semibold text-primary">
                            {getFirstLetters(`${user?.name}`)}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="hidden xl:inline">
                      <p className="font-semibold mt-1">{user?.name}</p>
                      <p className="text-medium -mt-2">@{user?.username}</p>
                    </div>
                  </div>
                  <EllipsisIcon className="hidden xl:inline" size={25} />
                </div>
              </div>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                className="rounded-xl shadow-xl w-auto lg:w-60 bg-white cursor-pointer overflow-hidden"
                sideOffset={5}
              >
                <div className="flex flex-col">
                  <div
                    onClick={logout}
                    role="button"
                    className="p-3 flex hover:bg-light items-center gap-2"
                  >
                    <LogOutIcon className="" size={15} />
                    <p className="font-semibold">
                      Logout{" "}
                      <span className="hidden lg:inline">
                        @{user?.username}
                      </span>
                    </p>
                  </div>
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </div>
      <MintPostModal isOpen={mintModal} setIsOpen={setMintModal} />
    </>
  );
}
