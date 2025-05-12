"use client";

import React, { useEffect } from "react";
import { LiveKitRoom } from "@livekit/components-react";
import { STREAM_WS } from "@/config/env";
import { walletToLowercase } from "@/libs/helpers";
import StreamerView from "./stream-components/StreamerView";
import ClientView from "./stream-components/ClientView";

type Props = {
  token?: string;
  hostIdentity: string;
  hostName: string;
  isStreaming: boolean;
  className?: string;
};

function StreamPlayer({
  token,
  hostIdentity,
  hostName,
  isStreaming,
  className,
}: Props) {
  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={STREAM_WS}
        className={`h-full w-full overflow-hidden ${className}`}
      >
        {isStreaming ? (
          <StreamerView
            hostIdentity={walletToLowercase(hostIdentity)}
            hostName={hostName}
            isStreaming={isStreaming}
          />
        ) : (
          <ClientView
            hostIdentity={walletToLowercase(hostIdentity)}
            hostName={hostName}
            isStreaming={isStreaming}
          />
        )}
      </LiveKitRoom>
    </>
  );
}

export default StreamPlayer;
