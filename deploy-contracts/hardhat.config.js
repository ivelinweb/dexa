require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

// Use a placeholder private key for compilation
const PRIVATE_KEY = process.env.PRIVATE_KEY !== "your_private_key_here"
  ? process.env.PRIVATE_KEY
  : "0000000000000000000000000000000000000000000000000000000000000001";

const RPC_URL = process.env.RPC_URL || "https://testnet.dplabs-internal.com";
const CHAIN_ID = parseInt(process.env.CHAIN_ID || "688688");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    pharosTestnet: {
      url: RPC_URL,
      accounts: [`0x${PRIVATE_KEY}`],
      chainId: CHAIN_ID,
      timeout: 120000, // 2 minutes
      gasPrice: 10000000000, // 10 gwei
    },
  },
};
