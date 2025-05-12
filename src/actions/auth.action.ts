import { SiweMessage } from "siwe";
import { setCookie, destroyCookie } from "nookies";
import { StorageTypes } from "@/libs/enum";
import { AuthData } from "@/interfaces/user.interface";
import { postApi, getApi, uploadApi } from "./api.action";
import { IActionResponse } from "@/interfaces/response.interface";

type IVerifyNonce = {
  message: string;
  signature: string;
};

export async function registerUser(wallet: string) {
  try {
    const payload = {
      wallet,
      nonce: "",
    };
    const response = await postApi("auth/register", payload);
    const data = response.data;
    if (response.status == true) {
      return { status: true, message: "success" };
    }
    return { status: false, message: "false" };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
}

export async function verifyNonce({
  signature,
  message,
}: IVerifyNonce): Promise<IActionResponse> {
  try {
    // Check if API_URL is configured
    if (!process.env.NEXT_PUBLIC_DEXA_API || process.env.NEXT_PUBLIC_DEXA_API === "") {
      console.warn("API URL is not configured. Using mock verification for development.");

      // Parse the message to get the wallet address
      const siwe = new SiweMessage(JSON.parse(message));
      const walletAddress = siwe.address;

      // Create a mock token
      const mockToken = `mock-token-${Date.now()}-${Math.random().toString(36).substring(2, 10)}`;

      // Set the cookie with the mock token
      setCookie(null, StorageTypes.ACCESS_TOKEN, mockToken, {
        httpOnly: false,
        path: "/",
        sameSite: "strict",
        secure: false,
        maxAge: 6 * 24 * 60 * 60,
      });

      // Return mock data
      return {
        status: true,
        message: "success",
        data: {
          ok: true,
          token: mockToken,
          user: {
            id: `mock-user-${Date.now()}`,
            wallet: walletAddress,
            username: `user_${walletAddress.substring(2, 8).toLowerCase()}`,
            name: `User ${walletAddress.substring(2, 8)}`,
          }
        }
      };
    }

    // If API is configured, make the actual API call
    const siwe = new SiweMessage(JSON.parse(message));
    const payload = {
      message: siwe,
      signature: signature,
    };
    const response = await postApi("auth/nonce/verify", payload);
    const data = response.data as AuthData;
    if (data.ok) {
      setCookie(null, StorageTypes.ACCESS_TOKEN, data.token, {
        httpOnly: false,
        path: "/",
        sameSite: "strict",
        secure: false,
        maxAge: 6 * 24 * 60 * 60,
      });
      return { status: true, message: "success", data };
    }
    return { status: false, message: "Signature verification failed" };
  } catch (error: any) {
    console.error("Error verifying signature:", error);
    return { status: false, message: error.message || "Failed to verify signature" };
  }
}

export async function getNonce(wallet: string): Promise<IActionResponse> {
  try {
    // Check if API_URL is configured
    if (!process.env.NEXT_PUBLIC_DEXA_API || process.env.NEXT_PUBLIC_DEXA_API === "") {
      console.warn("API URL is not configured. Using mock nonce for development.");
      // Return a mock nonce for development
      return {
        status: true,
        message: "success",
        data: {
          nonce: `mock-nonce-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
        }
      };
    }

    // If API is configured, make the actual API call
    const response = await getApi(`auth/nonce/generate?wallet=${wallet}`);
    const data = response.data;
    if (response.status == true && response.statusCode == 200) {
      return { status: true, message: "success", data: { nonce: data.nonce } };
    }
    return { status: false, message: "Failed to get nonce from API" };
  } catch (error: any) {
    console.error("Error getting nonce:", error);
    return { status: false, message: error.message || "Failed to get authentication nonce" };
  }
}

export async function updateProfile(
  payload: FormData
): Promise<IActionResponse> {
  try {
    const response = await uploadApi("user/update", payload);
    const data = response.data;
    if (response.status == true && response.statusCode == 201) {
      return {
        status: true,
        message: "success",
        data,
      };
    }
    return { status: false, message: "false" };
  } catch (error: any) {
    return { status: false, message: `${error.message}` };
  }
}

// reCAPTCHA verification function removed

// export async function clearSession() {
//   destroyCookie(null, StorageTypes.ACCESS_TOKEN);
// }
