const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy FeedsToken
  const FeedsToken = await hre.ethers.getContractFactory("FeedsToken");
  const feedsToken = await FeedsToken.deploy();
  await feedsToken.waitForDeployment();
  console.log("FeedsToken deployed to:", await feedsToken.getAddress());

  // Deploy DexaCreator
  const DexaCreator = await hre.ethers.getContractFactory("DexaCreator");
  const dexaCreator = await DexaCreator.deploy();
  await dexaCreator.waitForDeployment();
  console.log("DexaCreator deployed to:", await dexaCreator.getAddress());

  // Deploy DexaFeeds
  const DexaFeeds = await hre.ethers.getContractFactory("DexaFeeds");
  const dexaFeeds = await DexaFeeds.deploy(await dexaCreator.getAddress(), await feedsToken.getAddress());
  await dexaFeeds.waitForDeployment();
  console.log("DexaFeeds deployed to:", await dexaFeeds.getAddress());

  // Deploy DexaMessenger
  const DexaMessenger = await hre.ethers.getContractFactory("DexaMessenger");
  const dexaMessenger = await DexaMessenger.deploy(await dexaCreator.getAddress());
  await dexaMessenger.waitForDeployment();
  console.log("DexaMessenger deployed to:", await dexaMessenger.getAddress());

  // Initialize DexaCreator
  await dexaCreator.init_dexa_base(deployer.address);
  await dexaCreator.init_dexa_creator(deployer.address);
  await dexaCreator.init_roles(await dexaFeeds.getAddress(), await dexaMessenger.getAddress());
  console.log("DexaCreator initialized");

  // Add tokens to whitelist
  await dexaCreator.addTokenToWhitelist([await feedsToken.getAddress()]);
  console.log("Tokens added to whitelist");

  console.log("Deployment complete!");
  console.log("Contract addresses:");
  console.log("FeedsToken:", await feedsToken.getAddress());
  console.log("DexaCreator:", await dexaCreator.getAddress());
  console.log("DexaFeeds:", await dexaFeeds.getAddress());
  console.log("DexaMessenger:", await dexaMessenger.getAddress());

  // Set environment variables for update-env.js
  process.env.FEEDS_TOKEN_ADDRESS = await feedsToken.getAddress();
  process.env.DEXA_CREATOR_ADDRESS = await dexaCreator.getAddress();
  process.env.DEXA_FEEDS_ADDRESS = await dexaFeeds.getAddress();
  process.env.DEXA_MESSENGER_ADDRESS = await dexaMessenger.getAddress();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
