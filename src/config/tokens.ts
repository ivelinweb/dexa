import { BNB, BabyDoge, LINK, TUSD } from "@/components/Icons/NetworkIcons";
import { Coin } from "@/interfaces/feed.interface";
import { ZeroAddress } from "ethers";

export const Tokens: Coin[] = [
  {
    id: "pharos",
    address: ZeroAddress,
    symbol: "tPHAR",
    name: "Pharos Testnet",
    icon: BNB, // Reusing BNB icon for tPHAR
  },
  {
    id: "true-usd",
    address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    symbol: "TUSD", // USDT
    name: "True USD",
    icon: TUSD,
  },
  {
    id: "baby-doge-coin",
    address: "0x2fC661046c3365ecb408a491F14828eA90587304",
    symbol: "Baby Doge", // Decoin
    name: "Baby Doge",
    icon: BabyDoge,
  },
  {
    id: "chainlink",
    address: "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06",
    symbol: "LINK", // Link
    name: "Chainlink Coin",
    icon: LINK,
  },
];


