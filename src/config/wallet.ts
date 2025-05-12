import { type Chain } from "viem";
import { GREEN_CHAIN_ID, GRPC_URL, PHAROS_CHAIN_ID, PHAROS_RPC_URL } from "./env";

export const greenFieldTestnet = {
  id: GREEN_CHAIN_ID,
  name: "greenfield",
  nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
  rpcUrls: {
    default: {
      http: [GRPC_URL],
    },
    public: {
      http: [GRPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "BNB Greenfield Explorer",
      url: "https://testnet.greenfieldscan.com/",
    },
  },
  testnet: true,
} as const satisfies Chain;

export const pharosTestnet = {
  id: PHAROS_CHAIN_ID,
  name: "Pharos Testnet",
  nativeCurrency: { name: "tPHAR", symbol: "tPHAR", decimals: 18 },
  rpcUrls: {
    default: {
      http: [PHAROS_RPC_URL],
    },
    public: {
      http: [PHAROS_RPC_URL],
    },
  },
  blockExplorers: {
    default: {
      name: "Pharos Explorer",
      url: "https://testnet.pharosscan.xyz",
    },
  },
  testnet: true,
} as const satisfies Chain;
