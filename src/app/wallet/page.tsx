"use client";

import React, { useState, useEffect } from "react";
import Button from "@/components/Form/Button";
import Radio from "@/components/Form/Radio";
import Section from "@/components/Layouts/Section";
import WalletSearch from "@/components/Wallet/WalletSearch";
import Header from "@/components/ui/Header";
import TabsRoot from "@/components/Tabs/TabsRoot";
import TabsList from "@/components/Tabs/TabsList";
import TabsHeader from "@/components/Tabs/TabsHeader";
import TabsContent from "@/components/Tabs/TabsContent";
import AssetsTable from "@/components/Wallet/AssetsTable";
import { useConverter } from "@/context/currency.context";
import { useDexa } from "@/context/dexa.context";
import { useAuth } from "@/context/auth.context";
import { useReadContract } from "wagmi";
import { formatCur, walletToLowercase, weiToUnit } from "@/libs/helpers";
import { UserBalance } from "@/interfaces/user.interface";
import { Tokens } from "@/config/tokens";
import { useAppSelector, useAppDispatch } from "@/hooks/redux.hook";
import {
  selectHideBalance,
  setHideBalance,
} from "@/slices/account/hide-balance.slice";
import useStorage from "@/hooks/storage.hook";
import { StorageTypes } from "@/libs/enum";
import ListTransactions from "@/components/Wallet/ListTransactions";
import TransferModal from "@/components/Wallet/TransferModal";
import WithdrawModal from "@/components/Wallet/WithdrawModal";

function Wallet() {
  const isHidden = useAppSelector(selectHideBalance);
  const dispatch = useAppDispatch();
  const [balances, setBalances] = useState<UserBalance[]>([]);
  const [totalValue, setTotalValue] = useState<UserBalance>();
  const [activeTab, setActiveTab] = useState("tab1");
  const [isTransferModal, setIsTransferModal] = useState<boolean>(false);
  const [isWithdrawModal, setIsWithdrawModal] = useState<boolean>(false);
  const { setItem } = useStorage();
  const { usdRate, bnbRate } = useConverter();
  const { dexaCreator, CreatorABI } = useDexa();
  const { user } = useAuth();
  const { data } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "getTokenBalances",
    args: [`${user?.wallet}`],
  });

  const onTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  useEffect(() => {
    const init = async () => {
      if (!data) return;
      const userBal = (data as UserBalance[]).map((balance: UserBalance) => {
        const token = Tokens.find(
          (t) =>
            walletToLowercase(t.address) ===
            walletToLowercase(balance.tokenAddress)
        );
        const amt =
          Number(balance.balance) > 0 ? weiToUnit(balance.balance) : "0";
        const usdEqv =
          Object.keys(usdRate).length > 0
            ? usdRate[`${token?.id}`] * Number(amt)
            : undefined;
        return { ...balance, usdValue: usdEqv, ...(token || {}) };
      });
      if (Object.keys(bnbRate).length > 0 && Object.keys(usdRate).length > 0) {
        const convertedTotal = userBal.reduce((acc, token) => {
          const amt = Number(token.balance) > 0 ? weiToUnit(token.balance) : 0;
          return acc + amt * (bnbRate[`${token.id}`] || 0);
        }, 0);
        const usdEquiv = usdRate["binancecoin"] * convertedTotal;
        const bnbToken = Tokens.find((t) => t.id == "binancecoin");
        const payload: UserBalance = {
          ...bnbToken,
          balance: `${convertedTotal}`,
          tokenAddress: "",
          usdValue: usdEquiv,
        };
        console.log(payload);
        setTotalValue(payload);
      }
      setBalances(userBal);
    };
    init();
  }, [data, usdRate, bnbRate, user?.wallet]);

  const toggleHide = () => {
    const value = !isHidden;
    setItem(StorageTypes.DEXA_HIDE_BAL, value);
    dispatch(setHideBalance(value));
  };

  return (
    <Section isFull={true}>
      <div className="top-0 z-50 sticky">
        <Header title="Main Wallet" />
      </div>

      <div className="px-5 pt-5">
        {totalValue && <p className="text-sm">Total Balance</p>}
        <div className="flex items-end">
          {totalValue?.balance && (
            <div className="flex items-end">
              {isHidden ? (
                <p className="font-semibold text-lg -mb-1">*******</p>
              ) : (
                <p className="font-semibold text-lg -mb-1">
                  {Number(totalValue.balance) > 0
                    ? formatCur(totalValue?.balance)
                    : "0.00"}
                </p>
              )}

              <p className="text-xs text-medium pl-1 font-semibold">BNB</p>
            </div>
          )}

          {Number(totalValue?.balance) > 0 ? (
            totalValue?.usdValue && (
              <div className="flex items-end">
                {isHidden ? (
                  <p className="text-xs text-medium pl-2 font-semibold">
                    ******
                  </p>
                ) : (
                  <p className="text-xs text-medium pl-2 font-semibold">
                    = {formatCur(totalValue?.usdValue)} USD
                  </p>
                )}
              </div>
            )
          ) : (
            <></>
          )}
          {/* {totalValue.usdValue && (
            <div className="flex items-end">
              {isHidden ? (
                <p className="text-xs text-medium pl-2 font-semibold">******</p>
              ) : (
                <p className="text-xs text-medium pl-2 font-semibold">
                  = {formatCur(totalValue?.usdValue)} USD
                </p>
              )}
            </div>
          )} */}
        </div>
        <div className="flex items-center gap-x-5 pt-5">
          <Button type="button" kind="primary" shape="NORMAL">
            Deposit
          </Button>
          <Button
            type="button"
            kind="clear"
            shape="NORMAL"
            className="bg-light hover:bg-medium/20"
            onClick={() => setIsTransferModal(true)}
          >
            Transfer
          </Button>
          <Button
            type="button"
            kind="clear"
            shape="NORMAL"
            className="bg-light hover:bg-medium/20"
            onClick={() => setIsWithdrawModal(true)}
          >
            Withdraw
          </Button>
        </div>
        <div className="flex items-center gap-x-5 pt-5 max-w-2xl">
          <WalletSearch />
          <div className="flex items-center gap-x-2">
            <Radio type="checkbox" checked={isHidden} onChange={toggleHide} />
            <p className="text-sm">Hide balance</p>
          </div>
        </div>
        <div className="pt-5 pb-20">
          <TabsRoot>
            <TabsList className="">
              <TabsHeader
                isActiveText={true}
                title="My Assets"
                value="tab1"
                activeTabId={activeTab}
                onTabChange={onTabChange}
                isCenter={false}
                //isActiveBg={true}
              />
              <TabsHeader
                isActiveText={true}
                title="Transactions"
                value="tab2"
                activeTabId={activeTab}
                onTabChange={onTabChange}
                isCenter={false}
                //isActiveBg={true}
              />
            </TabsList>
            <TabsContent value="tab1" activeTabId={activeTab}>
              <div className="flex-1 mt-1">
                <AssetsTable
                  balances={balances}
                  setTransferModal={setIsTransferModal}
                  setWithdrawalModal={setIsWithdrawModal}
                />
              </div>
            </TabsContent>
            <TabsContent value="tab2" activeTabId={activeTab}>
              <div className="flex-1 mt-1">
                <ListTransactions />
              </div>
            </TabsContent>
          </TabsRoot>
        </div>
      </div>
      <TransferModal setIsOpen={setIsTransferModal} isOpen={isTransferModal} />
      <WithdrawModal setIsOpen={setIsWithdrawModal} isOpen={isWithdrawModal} />
    </Section>
  );
}

export default Wallet;
