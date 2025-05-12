"use client";

import React, { Suspense } from "react";
import { TwitterIcon, WalletIcon } from "lucide-react";
import Image from "next/image";
import ape1 from "@/assets/nft/1.png";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import Section from "@/components/Layouts/Section";
import Aside from "@/components/Layouts/Aside";
import ProfileTabs from "@/components/Profile/ProfileTabs";
import AuthMainLayout from "@/components/Layouts/AuthMainLayout";

export default function Profile() {
  return (
    <AuthMainLayout>
      <div className="flex space-x-5">
        <Section>
          <Suspense>
            <ProfileHeader />
          </Suspense>
          <Suspense>
            <ProfileTabs />
          </Suspense>
        </Section>
        <Aside>
          <div></div>
          {/* <div className="w-full p-3 shadow rounded-lg bg-white dark:bg-gray-700">
            <div className="border-b pb-3 border-gray-300">
              <p className="font-bold text-xl mb-2 dark:text-gray-200">About</p>
              <p className="text-md font-normal text-left dark:text-gray-300">
                Welcome to the Official Facebook Page of Dr. Pastor Paul
                Enenche, Senior Pastor of Dunamis Internati
              </p>
            </div>
            <div className="mt-2">
              <ul className="text-md dark:text-gray-400">
                <li className="py-1">
                  <p className="flex space-x-1">
                    <TwitterIcon className="h-6" />
                    <span>@garyvee</span>
                  </p>
                </li>
                <li className="py-1">
                  <p className="flex space-x-1">
                    <WalletIcon className="h-6" />
                    <span className="truncate">0x6918...1989</span>
                  </p>
                </li>
              </ul>
            </div>
            <div className="mt-3 flex -space-x-4 overflow-hidden">
              <Image
                height={20}
                width={20}
                alt=""
                className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-700"
                src={ape1}
              />
              <Image
                height={20}
                width={20}
                alt=""
                className="inline-block h-12 w-12 rounded-full ring-2 ring-white dark:ring-gray-700"
                src={ape1}
              />
            </div>
          </div>
          <div className="w-full p-3 mt-2 shadow rounded-lg bg-white dark:bg-gray-700">
            <div className="pb-3">
              <p className="font-bold text-xl mb-2">Recently Collected</p>
            </div>
            <div className="mt-2 grid grid-cols-3 gap-1">
              <div className="flex items-center justify-center rounded-md overflow-hidden">
                <Image src={ape1} alt="" />
              </div>
            </div>
          </div> */}
        </Aside>
      </div>
    </AuthMainLayout>
  );
}
