import React from "react";
import Video from "../Video";
import ChatContainer from "../chats-components/ChatContainer";
import LiveHeader from "../LiveHeader";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import { selectSidebar } from "@/slices/sidebar/sidebar.slice";
import ToggleMenu from "@/components/ui/ToggleMenu";
import Header from "@/components/ui/Header";
import {
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";

type Props = {
  hostIdentity: string;
  hostName: string;
  isStreaming: boolean;
};

export default function ClientView({
  hostIdentity,
  hostName,
  isStreaming,
}: Props) {
  const connState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const isOnline = participant && connState === ConnectionState.Connected;

  const dispatch = useAppDispatch();
  const isSidebar = useAppSelector(selectSidebar);

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden w-full h-full">
      <div className="bg-white overflow-hidden flex-none lg:flex-1 flex flex-col border-r border-light">
        <div
          className={`flex items-center relative bg-white border-b border-light ${
            isSidebar ? "px-2" : "xs:px-5"
          }`}
        >
          <div className="hidden xs:inline">
            <ToggleMenu />
          </div>
          <Header title="User" />
        </div>
        <div
          className={`${
            isSidebar ? "px-0" : "lg:p-5"
          } flex-1 flex flex-col overflow-hidden`}
        >
          <div
            className={`${
              isSidebar ? "rounded-none" : "lg:rounded-xl"
            }  overflow-hidden`}
          >
            <Video
              hostIdentity={hostIdentity}
              hostName={hostName}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-1 lg:flex-none overflow-hidden w-full lg:w-1/3">
        <ChatContainer
          hostIdentity={hostIdentity}
          hostName={hostName}
          isStreaming={isStreaming}
        />
      </div>
    </div>
  );
}
