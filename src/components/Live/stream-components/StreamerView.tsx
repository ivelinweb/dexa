import React from "react";
import Video from "../Video";
import Label from "@/components/Form/Label";
import Button from "@/components/Form/Button";
import { CircleIcon } from "lucide-react";
import LiveHeader from "../LiveHeader";
import StreamerSettingsTabs from "./StreamerSettingsTabs";
import {
  useConnectionState,
  useRemoteParticipant,
} from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import ChatContainer from "../chats-components/ChatContainer";
import ToggleMenu from "@/components/ui/ToggleMenu";

type Props = {
  hostIdentity: string;
  hostName: string;
  isStreaming: boolean;
};

function StreamerView({ hostIdentity, hostName, isStreaming }: Props) {
  const connState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);
  const isOnline = participant && connState === ConnectionState.Connected;

  return (
    <div className="flex flex-col lg:flex-row overflow-hidden w-full h-full">
      <div className="bg-light overflow-hidden flex-none lg:flex-1 flex flex-col border-r border-light">
        <div className="flex items-center bg-white py-1">
          <ToggleMenu />
          <LiveHeader
            title="Live streaming"
            className="bg-white flex-1 border-b-[0]"
            isBack={false}
          />
        </div>

        <div className="lg:p-5 flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-1 xl:grid-cols-2">
            <div className="bg-white">
              <Video
                hostIdentity={hostIdentity}
                hostName={hostName}
                isStreaming={isStreaming}
              />
            </div>
            <div className="bg-white hidden xl:flex px-5 flex-col gap-y-3 pt-5 relative">
              <div>
                <Label title="Title" />
                <p className="text-lg font-medium">Techcoach Live Stream</p>
              </div>
              <div>
                <Label title="Category" />
                <p className="text-base">Science & Technology</p>
              </div>
              <div>
                <Label title="Privacy" />
                <p className="text-base">Public</p>
              </div>
              <div className="absolute right-5 bottom-5">
                <Button type="button" kind="primary" size="SMALL">
                  Edit
                </Button>
              </div>
            </div>
          </div>
          <div className="bg-white px-5 py-3 hidden lg:block">
            {!isOnline ? (
              <div className="flex gap-x-3 items-center">
                <CircleIcon size={20} className="fill-warning stroke-warning" />
                <p className="text-dark">
                  Start sending us your video from your streaming software to go
                  live
                </p>
              </div>
            ) : (
              <div className="flex gap-x-3 items-center">
                <CircleIcon
                  size={20}
                  className="fill-success stroke-success animate-pulse"
                />
                <p className="text-dark">Streaming is live</p>
              </div>
            )}
          </div>
          <div className="mt-5 flex-1 hidden lg:block bg-white overflow-hidden">
            <StreamerSettingsTabs />
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

export default StreamerView;
