"use client";

import React from "react";
import { useAuth } from "@/context/auth.context";
import { ITransaction, txType } from "@/interfaces/transaction.interface";
import { weiToUnit } from "@/libs/helpers";
import Moment from "react-moment";
import TxFrom from "./TxFrom";
import TxTo from "./TxTo";
import { MoveDownLeftIcon, MoveUpRightIcon } from "lucide-react";
import { DEXA_CREATOR } from "@/config/env";

type Props = {
  tx: ITransaction;
};

function TxBodyItems({ tx }: Props) {
  const { user } = useAuth();
  const isWithdraw =
    tx.txFrom.toLocaleLowerCase() == DEXA_CREATOR?.toLocaleLowerCase();
  return (
    <>
      <tr className="h-14 border-b border-light last-of-type:border-none">
        <td className="px-4">
          <p className="text-sm text-center">{<tx.coin.icon />}</p>
        </td>
        <td className="px-4">
          <p
            className={`${
              tx.txFrom == user?.wallet
                ? "bg-danger/40"
                : isWithdraw
                ? "bg-danger/40"
                : "bg-primary/40"
            } text-xs inline pl-5 py-1 pr-2 rounded-md text-nowrap relative`}
          >
            {tx.txFrom == user?.wallet ? (
              <MoveUpRightIcon
                size={12}
                className="absolute top-[0.4rem] text-danger left-1"
              />
            ) : isWithdraw ? (
              <MoveUpRightIcon
                size={12}
                className="absolute top-[0.4rem] text-danger left-1"
              />
            ) : (
              <MoveDownLeftIcon
                size={12}
                className="absolute top-[0.4rem] text-primary left-1"
              />
            )}
            {txType[tx.txType]}
          </p>
        </td>
        <td className="px-4">
          <TxFrom tx={tx} />
        </td>
        <td className="px-4">
          <TxTo tx={tx} />
        </td>
        <td className="px-4">
          <p className="text-sm text-nowrap">
            {Number(tx.txAmount) > 0 ? weiToUnit(tx.txAmount) : "0.00"}{" "}
            {tx.coin.symbol}
          </p>
        </td>
        <td className="px-4">
          <p className="text-sm text-medium">
            {Number(tx.txFee) > 0 ? weiToUnit(tx.txFee) : "0"}
          </p>
        </td>
        <td className="px-4">
          <p className="text-sm flex text-nowrap">
            <Moment fromNow className="">
              {tx.txDate}
            </Moment>
          </p>
        </td>
      </tr>
    </>
  );
}

export default TxBodyItems;
