"use client";

import { createContext, useContext, useEffect, useState } from "react";
import DexaCreator from "@/contracts/DexaCreator.sol/DexaCreator.json";
import DexaFeeds from "@/contracts/DexaFeeds.sol/DexaFeeds.json";
import FeedsToken from "@/contracts/FeedsToken.sol/FeedsToken.json";
import DexaMessenger from "@/contracts/DexaMessenger.sol/DexaMessenger.json";
import ERC20Token from "@/contracts/ERC20/ERC20.json";
import {
  DEXA_FEEDS,
  DEXA_CREATOR,
  FEEDS_TOKEN,
  DEXA_MESSENGER,
} from "@/config/env";
import { toOxString } from "@/libs/helpers";
import { usePathname } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux.hook";
import { setSidebar } from "@/slices/sidebar/sidebar.slice";
import { fullScreenPath } from "@/libs/routes";

const CREATOR = toOxString(DEXA_CREATOR);
const FEEDS = toOxString(DEXA_FEEDS);
const FEEDSTOKEN = toOxString(FEEDS_TOKEN);
const MESSENGER = toOxString(DEXA_MESSENGER);

export type DexaContextType = {
  CreatorABI: any;
  FeedsABI: any;
  FeedsTokenABI: any;
  ERC20ABI: any;
  MessengerABI: any;
  dexaCreator: `0x${string}`;
  dexaFeeds: `0x${string}`;
  feedsToken: `0x${string}`;
  dexaMessenger: `0x${string}`;
};

interface Props {
  children: React.ReactNode;
}

export const DexaContext = createContext<DexaContextType | undefined>(
  undefined
);

export function DexaProvider({ children }: Props) {
  const path = usePathname();
  const dispatch = useAppDispatch();
  const [CreatorABI] = useState(DexaCreator);
  const [FeedsABI] = useState(DexaFeeds);
  const [FeedsTokenABI] = useState(FeedsToken);
  const [ERC20ABI] = useState(ERC20Token);
  const [MessengerABI] = useState(DexaMessenger);

  const [dexaCreator] = useState<`0x${string}`>(CREATOR);
  const [dexaFeeds] = useState<`0x${string}`>(FEEDS);
  const [feedsToken] = useState<`0x${string}`>(FEEDSTOKEN);
  const [dexaMessenger] = useState<`0x${string}`>(MESSENGER);

  useEffect(() => {
    if (fullScreenPath.includes(path)) {
      dispatch(setSidebar(false));
    } else {
      dispatch(setSidebar(true));
    }
  }, [path]);

  return (
    <DexaContext.Provider
      value={{
        CreatorABI,
        FeedsABI,
        FeedsTokenABI,
        dexaCreator,
        dexaFeeds,
        feedsToken,
        ERC20ABI,
        dexaMessenger,
        MessengerABI,
      }}
    >
      {children}
    </DexaContext.Provider>
  );
}

export function useDexa() {
  const context = useContext(DexaContext);
  if (context === undefined) {
    throw new Error("useDexa must be used within a DexaProvider");
  }
  return context;
}
