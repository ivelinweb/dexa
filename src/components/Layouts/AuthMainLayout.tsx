"use client";

import React, { useState, useEffect } from "react";
import Sidebar from "../Menus/Sidebar";
import MobileMenu from "../Menus/MobileMenu";
import { useAuth } from "@/context/auth.context";
import { useAccount } from "wagmi";
import WalletConnectModal from "../Auth/WalletConnectModal";
import SignInModal from "../Auth/Login/Signature";
import { useRouter } from "next/navigation";
import { routes } from "@/libs/routes";
import Loader from "../ui/Loader";
import { useAppSelector } from "@/hooks/redux.hook";
import { selectSidebar } from "@/slices/sidebar/sidebar.slice";

function AuthMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const [signModal, setSignModal] = useState<boolean>(false);
  const { isConnected, address } = useAccount();
  const { isAuthenticated, logout } = useAuth();
  const isSidebar = useAppSelector(selectSidebar);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    async function fetchNonce() {
      if (isConnected && address) {
        setSignModal(true);
      }
    }
    fetchNonce();
  }, [isConnected, address]);

  useEffect(() => {
    if (!isConnected && !address && !isAuthenticated()) {
      logout();
      router.push(routes.login);
    }
  }, [isConnected, address]);

  if (loading) {
    return <Loader />;
  }

  return isConnected && isAuthenticated() ? (
    <div className={`${!isSidebar ? "w-full" : "max-w-7xl"}  mx-auto bg-white`}>
      <div className="flex flex-col justify-between xs:justify-start xs:flex-row h-svh overflow-hidden relative overscroll-contain">
        <div
          className={`hidden ${
            !isSidebar ? "xs:hidden" : "xs:inline"
          }  md:w-1/5`}
        >
          <Sidebar />
        </div>
        <div className="flex-1 w-full lg:w-4/5 overflow-hidden">{children}</div>
        <MobileMenu />
      </div>
    </div>
  ) : (
    <div>
      {!isConnected && !signModal && !address ? (
        <WalletConnectModal setModal={setSignModal} />
      ) : (
        isConnected && <SignInModal setModal={setSignModal} />
      )}
    </div>
  );
}

export default AuthMainLayout;
