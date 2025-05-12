"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useStream } from "@/context/stream.context";
import StreamPlayer from "./StreamPlayer";
import { decryptMessage, walletToLowercase } from "@/libs/helpers";
import { useAuth } from "@/context/auth.context";
import { getUserStreamStatus } from "@/actions/stream.action";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import { selectSidebar, setSidebar } from "@/slices/sidebar/sidebar.slice";

function WatchLive() {
  const searchParam = useSearchParams();
  const wallet = searchParam.get("v");
  const dispatch = useAppDispatch();
  const isSidebar = useAppSelector(selectSidebar);
  const [hostId, setHostId] = useState<string>();
  const [isLive, setIsLive] = useState<boolean>(false);
  const { user } = useAuth();
  const { getViewerToken, viewerCredentials } = useStream();

  useEffect(() => {
    dispatch(setSidebar(false));
  }, []);

  useEffect(() => {
    if (wallet && user) {
      const decryptString = decryptMessage(decodeURIComponent(wallet));
      if (!decryptString) return;
      setHostId(walletToLowercase(decryptString));
      getViewerToken(`${decryptString}`, `${user.username}`);
    }
  }, [wallet, user]);

  useEffect(() => {
    const checkStatus = async () => {
      const decryptString = decryptMessage(decodeURIComponent(`${wallet}`));
      if (!decryptString) return;
      const statusRes = await getUserStreamStatus(decryptString);
      setIsLive(statusRes.data.status);
    };
    if (wallet) checkStatus();
  }, [wallet]);

  return (
    <>
      <StreamPlayer
        token={viewerCredentials?.token}
        hostIdentity={`${hostId}`}
        hostName={``}
        isStreaming={false}
        className={`${isSidebar ? "" : "rounded-xl overflow-hidden"}`}
      />
    </>
  );
}

export default WatchLive;
