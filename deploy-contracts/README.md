# Dexa Contract Deployment

This directory contains the smart contracts and deployment scripts for the Dexa application.

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- A wallet with tPHAR tokens on the Pharos Testnet

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Update the `.env` file with your private key:
   ```
   # Replace with your private key (without the 0x prefix)
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://testnet.dplabs-internal.com
   CHAIN_ID=688688
   ```

## Deployment

1. Compile the contracts:
   ```
   npx hardhat compile
   ```

2. Deploy the contracts to the Pharos Testnet:
   ```
   npm run deploy
   ```

3. Update the main project's `.env` file with the new contract addresses:
   ```
   npm run update-env
   ```

## Contracts

- **FeedsToken**: ERC20 token used for the Dexa feeds
- **DexaCreator**: Manages creator profiles and authentication
- **DexaFeeds**: Manages posts and feeds
- **DexaMessenger**: Manages messaging between users

## After Deployment

After deploying the contracts, the main project's `.env` file will be updated with the new contract addresses. You can then run the main project to test the new contracts:

```
cd ..
npm run dev
```
