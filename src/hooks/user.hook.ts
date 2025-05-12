"use client";

import { AuthData, UserInterface } from "@/interfaces/user.interface";
import { setSwitchChain } from "@/slices/account/switch-chain.slice";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  useAccount,
  useDisconnect,
  useReadContract,
  useSwitchChain,
  useAccountEffect,
} from "wagmi";
import useStorage from "./storage.hook";
import { useAppSelector } from "./redux.hook";
import { selectAuth, setAuth } from "@/slices/account/auth.slice";
import DexaCreator from "@/contracts/DexaCreator.sol/DexaCreator.json";
import { DEXA_CREATOR } from "@/config/env";
import { toOxString } from "@/libs/helpers";
import { routes } from "@/libs/routes";
import { parseCookies } from "nookies";
import { jwtDecode } from "jwt-decode";
import { StorageTypes } from "@/libs/enum";
import { useCookies } from "react-cookie";
import {
  selectHideBalance,
  setHideBalance,
} from "@/slices/account/hide-balance.slice";

const CREATOR = toOxString(DEXA_CREATOR);

function useUser() {
  const router = useRouter();
  const path = usePathname();
  const dispatch = useDispatch();
  const isAuth = useAppSelector(selectAuth);
  const isHidden = useAppSelector(selectHideBalance);
  const [user, setUser] = useState<UserInterface>();
  const [profileProgress, setProfileProgress] = useState<number>();
  const { address, isConnected, isDisconnected, chainId, isReconnecting } =
    useAccount();
  const { chains } = useSwitchChain();
  const { disconnect } = useDisconnect();
  const [_, set, remove] = useCookies([StorageTypes.ACCESS_TOKEN]);
  const { getItem, setItem } = useStorage();

  const { data, refetch: findCreator } = useReadContract({
    abi: DexaCreator,
    address: CREATOR,
    functionName: "findCreator",
    args: [address],
    query: { enabled: address ? true : false },
  });

  useAccountEffect({
    onConnect(data) {},
    onDisconnect() {
      logout();
    },
  });

  useEffect(() => {
    isAuthenticated();
  }, []);

  useEffect(() => {
    const isHidden = getItem(StorageTypes.DEXA_HIDE_BAL);
    dispatch(setHideBalance(!!isHidden));
  }, [isHidden]);

  useEffect(() => {
    if (data) {
      const user = data as any;
      const selectedFields = ["name", "username"];
      const completedFields = selectedFields.filter(
        (fieldName: any) =>
          user[fieldName] !== null &&
          user[fieldName] !== undefined &&
          user[fieldName] !== false
      ).length;
      const completetionPercentage =
        (completedFields / selectedFields.length) * 100;

      setProfileProgress(completetionPercentage);
    }
  }, [data]);

  useEffect(() => {
    const init = () => {
      if (data) {
        setUser({
          id: `${address}`,
          ...data,
        });
      }
    };
    init();
  }, [isConnected, isAuth, data]);

  useEffect(() => {
    const checkChain = () => {
      const isChain = chains.find((c) => c.id == chainId);
      if (!isChain && isConnected) {
        dispatch(setSwitchChain(true));
      } else {
        dispatch(setSwitchChain(false));
      }
    };
    checkChain();
  }, [chainId, chains, isConnected]);

  const isAuthenticated = () => {
    const parsedCookies = parseCookies();
    const cookie = parsedCookies[StorageTypes.ACCESS_TOKEN];

    if (!cookie) {
      return false;
    }

    try {
      const parsedCookie: any = jwtDecode(cookie);
      const expires = new Date(parsedCookie.exp * 1000);
      if (expires < new Date()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    disconnect();
    dispatch(setAuth(false));
    remove(StorageTypes.ACCESS_TOKEN);
    router.push(routes.login);
  };

  return {
    logout,
    user,
    profileProgress,
    setProfileProgress,
    isAuth,
    isAuthenticated,
    findCreator,
  };
}

export default useUser;
