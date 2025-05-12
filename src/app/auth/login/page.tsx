"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Image from "next/image";
import { favicon } from "@/components/Icons/Connector";
import SignInModal from "@/components/Auth/Login/Signature";
import ListConnectors from "@/components/Auth/ListConnectors";

export default function Login() {
  const [signModal, setSignModal] = useState<boolean>(false);
  const { isConnected, address } = useAccount();

  useEffect(() => {
    async function fetchNonce() {
      if (isConnected && address) {
        setSignModal(true);
      }
    }
    fetchNonce();
  }, [isConnected, address]);

  return (
    <div className="px-5 bg-primary/5 h-svh">
      {isConnected && signModal && <SignInModal setModal={setSignModal} />}
      <div className="max-w-lg mx-auto">
        <div className="flex justify-center pt-10">
          <Image
            src={favicon.main}
            width={260}
            height={260}
            alt={`dexa`}
            className="h-14 w-14"
          />
        </div>
        <div className="text-center py-4 mb-5">
          <p className="text-2xl font-semibold">Connect your wallet</p>
          <p className="text-medium">
            Seamlessly login to your account using your favourite wallet
          </p>
        </div>
        <div className="flex flex-col border border-primary/50 rounded-lg overflow-hidden">
          <ListConnectors setSignModal={setSignModal} />
        </div>
      </div>
    </div>
  );
}
