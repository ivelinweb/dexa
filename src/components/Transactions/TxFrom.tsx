"use client";
import React from "react";
import useClipBoard from "@/hooks/clipboard.hook";
import { ITransaction } from "@/interfaces/transaction.interface";
import { formatWalletAddress } from "@/libs/helpers";
import { CheckCheck, CopyIcon } from "lucide-react";

type Props = {
  tx: ITransaction;
};

function TxFrom({ tx }: Props) {
  const { isCopied, copy } = useClipBoard();
  return (
    <div className="flex items-center gap-x-1">
      <p className="text-sm">{formatWalletAddress(tx.txFrom, "...", 10, 10)}</p>
      {isCopied ? (
        <CheckCheck size={16} className="text-primary" />
      ) : (
        <CopyIcon
          size={16}
          className="cursor-pointer text-medium"
          onClick={async () => await copy(tx.txFrom)}
        />
      )}
    </div>
  );
}

export default TxFrom;
