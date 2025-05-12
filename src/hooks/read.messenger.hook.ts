"use client";
import { useDexaMessenger } from "@/context/dexa-messenger.context";
import { IReadContract } from "@/interfaces/contract.interface";
import { useReadContract } from "wagmi";

function useReadMessenger({
  functionName,
  args,
  query,
  account,
}: IReadContract) {
  const { MessengerABI, dexaMessenger } = useDexaMessenger();
  return useReadContract({
    abi: MessengerABI,
    address: dexaMessenger,
    functionName,
    account,
    args,
    query,
  });
}

export default useReadMessenger;
