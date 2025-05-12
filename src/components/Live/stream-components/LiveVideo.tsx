"use client";

import React, { useRef } from "react";
import { Participant, Track } from "livekit-client";
import { useTracks } from "@livekit/components-react";

type Props = {
  participant: Participant;
};

function LiveVideo({ participant }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useTracks([Track.Source.Camera, Track.Source.Microphone])
    .filter((t) => (t.participant.identity = participant.identity))
    .forEach((t) => {
      if (videoRef.current) {
        t.publication.track?.attach(videoRef.current);
      }
    });

  return (
    <div ref={wrapperRef} className="relative h-full flex">
      <video ref={videoRef} width={"100%"} />
    </div>
  );
}

export default LiveVideo;
