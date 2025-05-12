const fs = require('fs');
const path = require('path');

// Contract addresses from deployment
const FEEDS_TOKEN_ADDRESS = process.env.FEEDS_TOKEN_ADDRESS;
const DEXA_CREATOR_ADDRESS = process.env.DEXA_CREATOR_ADDRESS;
const DEXA_FEEDS_ADDRESS = process.env.DEXA_FEEDS_ADDRESS;
const DEXA_MESSENGER_ADDRESS = process.env.DEXA_MESSENGER_ADDRESS;

// Path to the .env file
const envFilePath = path.join(__dirname, '../../.env');

// Read the current .env file
let envContent = fs.readFileSync(envFilePath, 'utf8');

// Update the contract addresses
envContent = envContent.replace(/NEXT_PUBLIC_DEXA_CREATOR=.*/g, `NEXT_PUBLIC_DEXA_CREATOR=${DEXA_CREATOR_ADDRESS}`);
envContent = envContent.replace(/NEXT_PUBLIC_DEXA_FEEDS=.*/g, `NEXT_PUBLIC_DEXA_FEEDS=${DEXA_FEEDS_ADDRESS}`);
envContent = envContent.replace(/NEXT_PUBLIC_FEEDS_TOKEN=.*/g, `NEXT_PUBLIC_FEEDS_TOKEN=${FEEDS_TOKEN_ADDRESS}`);
envContent = envContent.replace(/NEXT_PUBLIC_DEXA_MESSENGER=.*/g, `NEXT_PUBLIC_DEXA_MESSENGER=${DEXA_MESSENGER_ADDRESS}`);

// Write the updated .env file
fs.writeFileSync(envFilePath, envContent);

console.log('Updated .env file with new contract addresses:');
console.log(`NEXT_PUBLIC_DEXA_CREATOR=${DEXA_CREATOR_ADDRESS}`);
console.log(`NEXT_PUBLIC_DEXA_FEEDS=${DEXA_FEEDS_ADDRESS}`);
console.log(`NEXT_PUBLIC_FEEDS_TOKEN=${FEEDS_TOKEN_ADDRESS}`);
console.log(`NEXT_PUBLIC_DEXA_MESSENGER=${DEXA_MESSENGER_ADDRESS}`);
