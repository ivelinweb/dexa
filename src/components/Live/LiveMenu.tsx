"use client";

import React, { useState } from "react";
import Image from "next/image";
import { favicon } from "../Icons/Connector";
import {
  CalendarPlusIcon,
  KeyIcon,
  ListCollapseIcon,
  RadioTowerIcon,
  WebcamIcon,
} from "lucide-react";
import { routes } from "@/libs/routes";
import Link from "next/link";
import { usePathname } from "next/navigation";

function LiveMenu() {
  const path = usePathname();
  const [isHide, setIsHide] = useState<boolean>(true);

  const navigation = [
    { name: "Stream", href: routes.app.live.desktop, icon: RadioTowerIcon },
    { name: "Webcam", href: routes.app.live.webcam, icon: WebcamIcon },
    { name: "Schedule", href: routes.app.live.event, icon: CalendarPlusIcon },
    { name: "Credentials", href: routes.app.live.credential, icon: KeyIcon },
  ];

  return (
    <div className="border-r border-light h-full flex flex-col justify-between">
      <div>
        <div className="relative">
          <div
            onClick={() => setIsHide(!isHide)}
            role="button"
            className={`hover:bg-light h-[3.8rem] border-b border-light gap-2 mb-5 flex items-center px-8 ${
              isHide ? "justify-center" : "justify-start"
            } `}
          >
            <ListCollapseIcon
              size={26}
              className={`${
                isHide ? "" : "rotate-180"
              }  transition-all duration-100`}
            />
            <p className={`${isHide ? "hidden" : "inline"}`}>Collapse</p>
          </div>

          <Link href={routes.app.home} className="flex justify-start px-6 pb-5">
            <Image
              src={favicon.main}
              width={260}
              height={260}
              alt={`dexa`}
              className="h-12 w-12"
            />
          </Link>

          {navigation.map((nav, idx) => (
            <Link
              prefetch={true}
              href={nav.href}
              key={idx}
              className={`flex justify-end ${
                isHide ? "justify-center" : "xl:justify-start"
              } group px-5`}
            >
              <div
                className={`flex space-x-2 group-hover:bg-primary/10 transition-all duration-200 rounded-[1.8rem] p-[0.8rem] xl:py-[0.8rem] xl:pl-3 ${
                  isHide ? "xl:pr-3" : "xl:pr-8"
                }`}
              >
                <nav.icon
                  className={`${
                    path.includes(nav.href)
                      ? "text-primary"
                      : "text-dark"
                  } group-hover:text-primary`}
                  size={26}
                />
                <p
                  className={`hidden ${
                    isHide ? "hidden" : "xl:inline"
                  } group-hover:text-primary text-lg ${
                    path.includes(nav.href)
                      ? "font-bold text-primary"
                      : "font-normal"
                  }`}
                >
                  {nav.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div>H</div>
    </div>
  );
}

export default LiveMenu;
