"use client";

import React from "react";
import Button from "@/components/Form/Button";
import Lottie from "lottie-react";
import dbAnim from "@/assets/lottie/live.json";
import evAnim from "@/assets/lottie/event.json";
import { routes } from "@/libs/routes";
import Link from "next/link";

function GoLive() {
  return (
    <div className="pt-20">
      <div className="max-w-3xl mx-auto">
        <div>
          <p className="text-3xl text-center font-semibold">
            Go live on dexa anytime, from anywhere.
          </p>
          <p className="text-medium/50 text-center">
            Reach your audience in real time from any device
          </p>
        </div>
        <div className="grid md:grid-cols-2 grid-cols-1 mt-10 gap-10">
          <div className="bg-light rounded-xl p-10 pb-20">
            <div className="pt-5 pb-10 flex justify-center">
              <Lottie animationData={evAnim} className="h-40 w-40" />
            </div>
            <div className="text-center">
              <p className="text-2xl">Schedule an event</p>
              <p className="text-medium mt-2">
                Promote your event before you go live to get maximum exposure
              </p>
            </div>
            <div className="flex gap-5 mt-6 justify-center shrink-0">
              <Button type={"button"} kind={"primary"} shape={"ROUNDED"}>
                Schedule Event
              </Button>
            </div>
          </div>
          <div className="bg-light rounded-xl p-10 pb-20">
            <div className="pt-5 pb-10 flex justify-center">
              <Lottie animationData={dbAnim} className="h-40 w-40" />
            </div>
            <div className="text-center">
              <p className="text-2xl">Go live now</p>
              <p className="text-medium mt-2">
                Start a live stream right away from your mobile device or laptop
              </p>
            </div>
            <div className="flex gap-5 mt-6 justify-center shrink-0">
              <Link
                className="flex-1 block"
                prefetch={true}
                href={routes.app.live.desktop}
              >
                <Button
                  type={"button"}
                  kind={"primary"}
                  shape={"ROUNDED"}
                  className="w-full"
                >
                  Mobile
                </Button>
              </Link>

              <Link
                className="flex-1 block"
                prefetch={true}
                href={routes.app.live.desktop}
              >
                <Button
                  type={"button"}
                  kind={"primary"}
                  shape={"ROUNDED"}
                  className="w-full"
                >
                  Desktop
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GoLive;
