import CryptoJS, { AES } from "crypto-js";
import { generateToken, lowerTokenAlphaNumeric } from "./generateId";
import { APP_SECRET } from "@/config/env";

export function toOxString(value?: string) {
  return value as `0x${string}`;
}

export function formatWalletAddress(
  walletAddress: string,
  separator?: string,
  startAt?: number,
  endAt?: number
) {
  if (typeof walletAddress !== "string" || walletAddress.length < 6) {
    return "Invalid wallet address";
  }

  const prefix = startAt
    ? walletAddress.substring(0, startAt)
    : walletAddress.substring(0, 5);
  const suffix = endAt
    ? walletAddress.substring(walletAddress.length - endAt)
    : walletAddress.substring(walletAddress.length - 4);
  const div = separator ? separator : "...";

  return `${prefix}${div}${suffix}`;
}

export const getWagmiError = (inputString: string) => {
  // Split the input string by line breaks
  const lines = inputString.split("\n");

  // Initialize an empty array to store the sentences
  const sentences = [];

  // Iterate through each line
  for (let line of lines) {
    // Trim leading and trailing whitespace from the line
    line = line.trim();

    // If the line is not empty, split it into sentences and add the first sentence to the array
    if (line !== "") {
      // Split the line into sentences using period ('.') as the delimiter
      const lineSentences = line.split(".");

      // Add the first sentence to the array
      sentences.push(lineSentences[0]);

      // Break the loop as we only need the first sentence
      break;
    }
  }

  // Join the sentences array into a single string and return it
  return sentences.join(". ");
};

export function generateBucket(address: string) {
  const bucketName = formatWalletAddress(`${address}`, "-", 5, 5);
  const bucketId = generateToken(lowerTokenAlphaNumeric, 5, true);
  const defaultBucket = `dexa-${bucketName}-${bucketId}`.toLowerCase();
  return defaultBucket;
}

export const walletToLowercase = (wallet: string) => {
  return wallet.toLowerCase();
};

export const weiToUnit = (wei: string | number) => {
  const unit = Number(wei) / 1e18;
  return unit;
};

export const getFirstLetters = (fullName: string) => {
  const words = fullName.split(" ");
  let initials = "";
  for (const word of words) {
    const firstLetter = word[0]?.toUpperCase();
    if (firstLetter) {
      initials += firstLetter;
    }
  }
  return initials;
};

export const timestampToDate = (time: string | number) => {
  const date = new Date(Number(time) * 1000);
  return date;
};

export const encryptMessage = (message: string) => {
  return CryptoJS.AES.encrypt(message, `${APP_SECRET}`).toString();
};

export const decryptMessage = (encryptedMessage: string) => {
  const bytes = CryptoJS.AES.decrypt(encryptedMessage, `${APP_SECRET}`);
  return bytes.toString(CryptoJS.enc.Utf8);
};

export const stringToColor = (str: string) => {
  // Hash function to convert string to a number (modify if needed)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert hash to a hex color string (adjust for desired color range)
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
};

export const stringToColorWithCheck = (str: string) => {
  // Hash function to convert string to a number (modify if needed)
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Function to check if a color has sufficient luminance for white text
  const isLightEnough = (color: string) => {
    // Convert hex to RGB values
    const rgb = {
      r: parseInt(color.substring(1, 3), 16),
      g: parseInt(color.substring(3, 5), 16),
      b: parseInt(color.substring(5, 7), 16),
    };

    // Calculate relative luminance (WCAG 2.1 formula)
    const lum =
      (0.2126 * rgb.r) / 255 + (0.7152 * rgb.g) / 255 + (0.0722 * rgb.b) / 255;
    return lum > 0.5; // Adjust threshold as needed (higher for better contrast)
  };

  // Generate random color and loop until it's light enough
  let color;
  do {
    color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += value.toString(16).padStart(2, "0");
    }
  } while (!isLightEnough(color));

  return color;
};

export const isLikelyUsername = (str: string) => {
  if (!str || str.length < 3) {
    return false;
  }

  const usernameRegex = /^[a-zA-Z0-9]+$/;
  return usernameRegex.test(str);
};

export const isValidPostID = (str: string) => {
  const idRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return idRegex.test(str);
};

export function formatCur(value: string | number) {
  const cur = Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "NGN",
    maximumSignificantDigits: 10,
    currencySign: "accounting",
  });
  const cleanInp = value.toString()?.replace(/(,)/g, "");
  const fAmt = cur.format(Number(cleanInp));
  const amount = fAmt.toString().replace(/(NGN|\s)/g, "");
  return amount;
}

export function isNumber(value: number) {
  return !isNaN(value);
}
