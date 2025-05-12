"use client";

import useStreamHook from "@/hooks/stream.hook";
import {
  IStreamCredentials,
  IStreamViewerCredentials,
} from "@/interfaces/stream.interface";
import { createContext, useContext } from "react";

export type StreamContextType = {
  streamCredentials?: IStreamCredentials;
  viewerCredentials?: IStreamViewerCredentials;
  getViewerToken: (hostId: string, username: string) => Promise<void>;
};

interface Props {
  children: React.ReactNode;
}

export const StreamContext = createContext<StreamContextType | undefined>(
  undefined
);

export function StreamProvider({ children }: Props) {
  const stream = useStreamHook();

  return (
    <StreamContext.Provider
      value={{
        ...stream,
      }}
    >
      {children}
    </StreamContext.Provider>
  );
}

export function useStream() {
  const context = useContext(StreamContext);
  if (context === undefined) {
    throw new Error("useStream must be used within a StreamProvider");
  }
  return context;
}
