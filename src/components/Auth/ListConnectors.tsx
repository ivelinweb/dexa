"use client";

import React, { Suspense, useEffect, useState } from "react";
import Button from "../Form/Button";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { config } from "@/config/wagmi.config";
import useToast from "@/hooks/toast.hook";
import { connectorIcons } from "../Icons/Connector";
import { getWagmiError } from "@/libs/helpers";

type Props = {
  setSignModal?: (value: boolean) => void;
  onCloseModal?: (value: boolean) => void;
};

function ListConnectors({ setSignModal, onCloseModal }: Props) {
  const [isClient, setIsClient] = useState(false);
  const { loading, error: tError, success } = useToast();
  const { connect, connectors, error, isPending, isSuccess, isError } =
    useConnect({
      config,
    });
  const { isConnected, address } = useAccount();

  useEffect(() => {
    setIsClient(true)
  },[isClient])

  useEffect(() => {
    const check = () => {
      if (isSuccess) {
        success({ msg: "Wallet connected" });
        if (onCloseModal) onCloseModal(false);
      }
      if (isError) {
        tError({ msg: getWagmiError(error.message) });
      }
    };
    check();
  }, [isPending, isSuccess, isError]);

  const connectToWallet = async (connector?: any) => {
    try {
      if (!isConnected) {
        loading({ msg: "Authenticating..." });
        connect({ connector });
        return;
      }
      if (setSignModal) setSignModal(true);
    } catch (error) {
      console.log("error", error);
    }
  };

  return (
    <>
      {isClient && connectors && connectors.toReversed().map((connector) => (
        <Button
          key={connector.uid}
          kind={`default`}
          onClick={() => connectToWallet(connector)}
          className="py-[1rem] capitalize border-b border-primary/50 hover:bg-primary/5 rounded-none last:border-none"
        >
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {connectorIcons[connector.id] ? (
                <Image
                  src={connectorIcons[connector.id].icon}
                  alt={connectorIcons[connector.id].key}
                  height={25}
                  width={25}
                />
              ) : (
                <Image
                  unoptimized
                  src={decodeURIComponent(`${connector.icon}`)}
                  alt={""}
                  height={25}
                  width={25}
                />
              )}
              <span className="ml-3 font-medium">{connector.name}</span>
            </div>
            {connector.id === "io.metamask" && (
              <span className="text-xs bg-primary text-white px-3 rounded-sm">
                Popular
              </span>
            )}
          </div>
        </Button>
      ))}
    </>
  );
}

export default ListConnectors;
