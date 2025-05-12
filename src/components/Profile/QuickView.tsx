"use client";

import React, { useState, useEffect, useRef } from "react";
import Button from "../Form/Button";
import {
  ArrowLeftRightIcon,
  EyeIcon,
  EyeOffIcon,
  SquareMinusIcon,
  WalletMinimalIcon,
} from "lucide-react";
import { BNB } from "../Icons/NetworkIcons";
import BlueCheckMark from "./BlueCheck";
import { useAuth } from "@/context/auth.context";
import { UserBalance } from "@/interfaces/user.interface";
import { useAccount, useReadContract } from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { Tokens } from "@/config/tokens";
import { walletToLowercase } from "@/libs/helpers";
import Link from "next/link";
import QuickViewBal from "./QuickViewBal";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import { useRouter } from "next/navigation";
import { routes } from "@/libs/routes";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import {
  selectHideBalance,
  setHideBalance,
} from "@/slices/account/hide-balance.slice";
import useStorage from "@/hooks/storage.hook";
import { StorageTypes } from "@/libs/enum";
import WithdrawModal from "../Wallet/WithdrawModal";

function QuickView() {
  const router = useRouter();
  const isHidden = useAppSelector(selectHideBalance);
  const dispatch = useAppDispatch();
  const [balances, setBalances] = useState<UserBalance[]>([]);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const { setItem } = useStorage();
  const { address } = useAccount();
  const { user } = useAuth();
  const { dexaCreator, CreatorABI } = useDexa();
  const { data } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "getTokenBalances",
    args: [`${address}`],
  });

  useEffect(() => {
    router.prefetch(routes.app.wallet.index);
  }, [router]);

  useEffect(() => {
    const init = () => {
      if (!data) return;
      const userBal = (data as UserBalance[]).map((balance: UserBalance) => {
        const token = Tokens.find(
          (t) =>
            walletToLowercase(t.address) ===
            walletToLowercase(balance.tokenAddress)
        );
        return { ...balance, ...(token || {}) };
      });
      setBalances(userBal);
    };
    init();
  }, [data, address]);

  const toggleHide = () => {
    const value = !isHidden;
    setItem(StorageTypes.DEXA_HIDE_BAL, value);
    dispatch(setHideBalance(value));
  };

  return (
    <div className="w-full p-3 rounded-2xl border border-light bg-white">
      <div className="flex justify-between sticky top-0 bg-white">
        <p className="hidden xl:inline text-base xl:text-lg font-semibold">
          Profile
        </p>
        <div className="flex flex-1 gap-3 items-center justify-between xl:justify-end text-right">
          <div className="name">
            <Link
              prefetch={true}
              href={routes.app.profile(`${user?.username}`)}
              className="font-bold text-base flex items-center gap-1 capitalize"
            >
              <span>{user?.name}</span> <BlueCheckMark />
            </Link>
            <p className="text-medium text-left text-sm">Professional</p>
          </div>
          <CreatorPFP
            username={user?.username}
            name={user?.name}
            pfp={user?.pfp}
          />
        </div>
      </div>
      <div>
        <div className="bg-quick-view bg-contain p-5 mt-2 rounded-xl">
          <div className="mb-5 text-light">
            <p className="font-light flex justify-between items-center">
              <span className="">Account balance</span>
              <span className="cursor-pointer p-2 text-xl" onClick={toggleHide}>
                {isHidden ? <EyeOffIcon size={20} /> : <EyeIcon size={20} />}
              </span>
            </p>
            {isHidden ? (
              <div className="mb-2">
                <p>
                  <span className="text-5xl font-semibold">*****</span>
                </p>
                <p className="font-light -mt-4 text-2xl">******</p>
              </div>
            ) : (
              <>
                {balances.length > 1 ? (
                  <Swiper
                    modules={[Autoplay]}
                    autoplay={{ delay: 5000 }}
                    slidesPerView={1}
                    direction={"vertical"}
                    className="h-16"
                    loop={true}
                    speed={2000}
                  >
                    {balances.map((bal, index) => (
                      <SwiperSlide key={index}>
                        <QuickViewBal
                          balance={bal}
                          icon={bal.icon ? <bal.icon /> : <></>}
                        />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <>
                    {balances.length < 1 ? (
                      <QuickViewBal icon={<BNB />} />
                    ) : (
                      <>
                        {balances.map((bal, index) => (
                          <QuickViewBal
                            key={index}
                            balance={bal}
                            icon={bal.icon ? <bal.icon /> : <></>}
                          />
                        ))}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          <div className="flex xl:flex-row flex-col gap-2 xl:gap-5 justify-center">
            <Button
              onClick={() => router.push(routes.app.wallet.index)}
              kind="default"
              shape={"ROUNDED"}
              className="text-sm border border-white"
            >
              My Wallet
            </Button>
            <Button
              onClick={() => setIsWithdrawModal(true)}
              shape={"ROUNDED"}
              kind="primary"
              className="text-sm border bg-transparent border-white"
            >
              Withdraw
            </Button>
          </div>
        </div>
        {/* <div className="text-center mt-4 flex shrink-0 cursor-pointer transition-all duration-500">
          <div className="flex flex-1 text-primary group flex-col items-center">
            <div className="h-12 w-12 mb-1 rounded-full group-hover:bg-primary/15 transition-all duration-150 bg-primary/20 flex items-center justify-center">
              <WalletMinimalIcon size={22} />
            </div>
            <p className="text-xs">Deposit</p>
          </div>
          <div className="flex flex-1 text-primary group flex-col items-center">
            <div className="h-12 w-12 mb-1 rounded-full group-hover:bg-primary/15 transition-all duration-150 bg-primary/20 flex items-center justify-center">
              <SquareMinusIcon size={22} />
            </div>
            <p className="text-xs">Withdraw</p>
          </div>
          <div className="flex flex-1 text-primary group flex-col items-center">
            <div className="h-12 w-12 mb-1 rounded-full group-hover:bg-primary/15 transition-all duration-150 bg-primary/20 flex items-center justify-center">
              <ArrowLeftRightIcon size={22} />
            </div>
            <p className="text-xs">Transfer</p>
          </div>
        </div> */}
      </div>
      <WithdrawModal isOpen={isWithdrawModal} setIsOpen={setIsWithdrawModal} />
      {/* <AddFundModal isOpen={fundShelveModal} setIsOpen={setFundShelveModal} /> */}
    </div>
  );
}

export default QuickView;
