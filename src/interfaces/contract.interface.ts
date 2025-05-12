import { Account } from "viem/accounts";

export interface IReadContract {
  functionName: string;
  args?: readonly unknown[] | undefined;
  account?: `0x${string}` | Account | undefined;
  query?: any;
}