import { Coin } from "./feed.interface";

export const txType = {
  "0": "Remint",
  "1": "Tip",
  "2": "Deposit",
  "3": "Transfer",
};

export enum TxType {
  Remint = "0",
  Tip = "1",
  Deposit = "2",
  Transfer = "3",
}

export interface ITransaction {
  txId: number;
  txType: TxType;
  txFrom: string;
  txTo: string;
  txAmount: string;
  txFee: string;
  txDate: string;
  tokenAddress: string;
  coin: Coin
}
