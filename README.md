# Dexa - Decentralized Social Platform

![Dexa](/assets/bg.jpg)

Dexa is a decentralized social platform built on blockchain technology, enabling users to create profiles, share content, interact with other users, and participate in a tokenized ecosystem. The platform leverages smart contracts on the Pharos blockchain to provide a secure, transparent, and censorship-resistant social experience.

## Demo / Pitch video

[![Watch the demo](https://img.youtube.com/vi/8q8Qp6LvHSY/hqdefault.jpg)](https://www.youtube.com/watch?v=XdYsW78sArI)

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Smart Contracts](#smart-contracts)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
  - [Running the Application](#running-the-application)
- [Smart Contract Deployment](#smart-contract-deployment)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Decentralized Authentication**: Connect with Web3 wallets (MetaMask, WalletConnect)
- **Profile Creation**: Create and manage your decentralized identity
- **Content Sharing**: Post text, images, and other media
- **Social Interactions**: Follow users, like and comment on posts
- **Messaging**: Direct messaging between users
- **Live Streaming**: Create and watch live streams
- **Token Economy**: Integrated with FeedsToken for platform interactions
- **Bookmarks**: Save and organize content
- **Explore**: Discover trending content and users
- **Wallet Integration**: Manage your crypto assets within the platform

## Technology Stack

### Frontend
- **Next.js**: React framework for server-rendered applications
- **TypeScript**: Typed JavaScript for better development experience
- **TailwindCSS**: Utility-first CSS framework
- **Redux Toolkit**: State management
- **React Query**: Data fetching and caching
- **Wagmi**: React hooks for Ethereum
- **SIWE (Sign-In with Ethereum)**: Authentication protocol

### Backend
- **Smart Contracts**: Solidity contracts deployed on Pharos Testnet
- **Hardhat**: Development environment for Ethereum software
- **Ethers.js**: Library for interacting with the Ethereum blockchain

### Blockchain
- **Pharos Testnet**: The blockchain network used for development and testing
  - Chain ID: 688688
  - RPC URL: https://testnet.dplabs-internal.com
  - Explorer: https://testnet.pharosscan.xyz

## Project Structure

```
dexa/
├── contracts/                # Smart contract source files
├── deploy-contracts/         # Contract deployment scripts and configuration
├── public/                   # Static assets
├── src/
│   ├── actions/              # API and action creators
│   ├── app/                  # Next.js app router pages
│   ├── assets/               # Images, icons, and other assets
│   ├── components/           # Reusable UI components
│   ├── config/               # Configuration files
│   ├── context/              # React context providers
│   ├── contracts/            # Contract ABIs and interfaces
│   ├── hooks/                # Custom React hooks
│   ├── interfaces/           # TypeScript interfaces
│   ├── libs/                 # Utility functions and helpers
│   ├── schemas/              # Validation schemas
│   ├── slices/               # Redux slices
│   └── styles/               # Global styles
├── .env                      # Environment variables
├── .env.example              # Example environment variables
├── next.config.mjs           # Next.js configuration
├── package.json              # Dependencies and scripts
└── tailwind.config.ts        # TailwindCSS configuration
```

## Smart Contracts

Dexa uses several smart contracts to manage different aspects of the platform:

1. **FeedsToken**: ERC20 token used for the Dexa ecosystem
   [0x99fA2C17fC269FA23ADd4E71cDE3210B1174f3B8](https://testnet.pharosscan.xyz/address/0x99fa2c17fc269fa23add4e71cde3210b1174f3b8)
2. **DexaCreator**: Manages user profiles and authentication
   [0xC6dD53Fc5ddAEA85EdbFdD149784C0B3cA6AFbD3](https://testnet.pharosscan.xyz/address/0xC6dD53Fc5ddAEA85EdbFdD149784C0B3cA6AFbD3)
3. **DexaFeeds**: Handles posts, comments, and social interactions
   [0x10c9Ab23a88a17fe62687Df67895F1bC7f6ba05A](https://testnet.pharosscan.xyz/address/0x10c9Ab23a88a17fe62687Df67895F1bC7f6ba05A)
4. **DexaMessenger**: Manages messaging between users
   [0x18c9CbC1E055aBA2494Bc1d787436586EAca8456](https://testnet.pharosscan.xyz/address/0x18c9CbC1E055aBA2494Bc1d787436586EAca8456)

These contracts are deployed on the Pharos Testnet and can be found in the `contracts/` directory.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- MetaMask or another Web3 wallet
- Access to Pharos Testnet

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ivelinweb/dexa.git
   cd dexa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Environment Configuration

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:

### Running the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3000`

## Smart Contract Deployment

To deploy the smart contracts to the Pharos Testnet:

1. Navigate to the deploy-contracts directory:
   ```bash
   cd deploy-contracts
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Update the `.env` file with your private key:
   ```
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://testnet.dplabs-internal.com
   CHAIN_ID=688688
   ```

4. Compile the contracts:
   ```bash
   npx hardhat compile
   ```

5. Deploy the contracts:
   ```bash
   npm run deploy
   ```

6. Update the main project's `.env` file with the new contract addresses:
   ```bash
   npm run update-env
   ```

For more details, see the [deploy-contracts README](deploy-contracts/README.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
