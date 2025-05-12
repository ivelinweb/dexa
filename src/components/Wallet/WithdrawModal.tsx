"use client";

import React, { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Label from "../Form/Label";
import Input from "../Form/Input";
import Button from "../Form/Button";
import { XIcon } from "lucide-react";
import Select, { Options } from "../Form/Select";
import { Tokens } from "@/config/tokens";
import { useForm, Controller, FieldValues } from "react-hook-form";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { UserBalance } from "@/interfaces/user.interface";
import {
  formatWalletAddress,
  walletToLowercase,
  weiToUnit,
} from "@/libs/helpers";
import { withdrawalResolver } from "@/schemas/withdraw.schema";
import ShowError from "../Form/ShowError";
import useToast from "@/hooks/toast.hook";
import { parseEther } from "ethers";
import { useAuth } from "@/context/auth.context";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
};

function WithdrawModal({ isOpen, setIsOpen }: Props) {
  const {
    trigger,
    control,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ ...withdrawalResolver });
  const { address } = useAccount();
  const { error, loading, success } = useToast();
  const [amount, setAmount] = useState<string>("0.00");
  const [resetKey, setResetKey] = useState<number>(0);
  const [selectedToken, setSelectedToken] = useState<Options>();
  const [tokenBalance, setTokenBalance] = useState<UserBalance>();
  const { dexaCreator, CreatorABI } = useDexa();
  const { user } = useAuth();
  const { writeContractAsync, isPending } = useWriteContract();
  const [options] = useState(
    Tokens.map((t) => {
      return { value: t.address, name: t.symbol, icon: t.icon };
    })
  );

  const { data } = useReadContract({
    abi: CreatorABI,
    address: dexaCreator,
    functionName: "getTokenBalances",
    args: [`${address}`],
  });

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
      const token = userBal.find((b) => b.address == selectedToken?.value);
      setTokenBalance(token);
    };
    init();
  }, [data, selectedToken]);

  const setMax = () => {
    if (!tokenBalance) return;
    const amount = weiToUnit(`${tokenBalance?.balance}`);
    setValue("amount", amount);
    setAmount(`${amount}`);
    trigger("amount");
  };

  const onSubmit = async (payload: FieldValues) => {
    try {
      const { token, amount } = payload;
      loading({
        msg: "Initiating withdrawal",
      });
      await writeContractAsync(
        {
          abi: CreatorABI,
          address: dexaCreator,
          functionName: "creatorTransfer",
          args: [`${user?.wallet}`, token, parseEther(`${amount}`)],
        },
        {
          onSuccess: async (data) => {
            success({
              msg: `${amount} ${tokenBalance?.symbol} withdrawn succesfully`,
            });
            closeModal();
            resetForm();
          },
          onError(err) {
            error({ msg: `${err.message}` });
          },
        }
      );
    } catch (err) {
      if (err instanceof Error) {
        error({ msg: err.message });
      }
      if (err && typeof err === "object") {
        error({ msg: JSON.stringify(err) });
      }
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const resetForm = () => {
    setAmount("0.00");
    reset();
    setResetKey((prevKey) => prevKey + 1);
    setTokenBalance(undefined);
    setSelectedToken(undefined);
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 bg-dark/50 overflow-y-auto scrollbar-hide"
        onClose={closeModal}
      >
        <div className="min-h-screen bg-white md:bg-transparent md:px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="hidden md:inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-xl max-h-svh md:max-h-[45rem] md:pb-10 md:my-8 overflow-scroll scrollbar-hide text-left align-middle transition-all transform bg-white md:shadow-2xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg px-4 py-2 flex top-0 sticky z-20 bg-white border-b border-light justify-between items-center leading-6 m-0 text-dark/80"
              >
                <div className="flex items-center gap-x-2">
                  <span className="font-bold">Withdraw</span>
                </div>
                <Button
                  shape={"CIRCLE"}
                  kind="clear"
                  type={"button"}
                  onClick={closeModal}
                  className={"hover:bg-medium/20"}
                >
                  <XIcon size={22} />
                </Button>
              </Dialog.Title>
              <div className="flex flex-col gap-5 md:gap-6 px-5 pt-2 ">
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
                  <div className="flex-1">
                    <Label title="Token" isMargin={true} isRequired={true} />
                    <Controller
                      control={control}
                      render={({ field: { onChange } }) => (
                        <Select
                          options={options}
                          placeholder="Choose option"
                          onSelect={(token) => {
                            setSelectedToken(token);
                            onChange(token.value);
                          }}
                          key={resetKey}
                        />
                      )}
                      name={"token"}
                    />
                    {errors.token && (
                      <ShowError error={`${errors.token?.message}`} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-3 md:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col gap-5">
                      <div className="flex-1">
                        <Label
                          title="Amount"
                          isMargin={true}
                          isRequired={true}
                        />
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <div className="flex items-center relative bg-light">
                              <Input
                                isOutline={false}
                                className="bg-light text-sm"
                                placeholder="Min amount: 0.01"
                                onChange={(e) => {
                                  onChange(e);
                                  setAmount(e.target.value);
                                }}
                                value={value ? value : ""}
                              />
                              {Number(tokenBalance?.balance) > 0 && (
                                <div
                                  role="button"
                                  onClick={setMax}
                                  className="flex gap-1 p-4"
                                >
                                  <p className="text-primary text-sm font-semibold">
                                    Max
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                          name={"amount"}
                        />
                        {errors.amount && (
                          <ShowError error={`${errors.amount?.message}`} />
                        )}
                        <div className="flex gap-3 items-center text-primary">
                          <p className="text-sm font-semibold">
                            Available Balance:
                          </p>
                          <p className="text-sm font-semibold">
                            {tokenBalance
                              ? `${weiToUnit(tokenBalance.balance)}`
                              : "0.00"}{" "}
                            {selectedToken?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6">
                      <p className="text-sm text-medium truncate">
                        Your withdrawal will be processed to your connected
                        wallet address.
                      </p>
                      <p className="text-primary text-sm font-bold">
                        {formatWalletAddress(`${user?.wallet}`, "...", 10, 10)}
                      </p>
                    </div>
                    <div className="flex justify-between mt-2 items-center">
                      <div className="flex flex-col">
                        <p className="text-sm">Amount Recieved</p>
                        <div className="flex gap-1 items-center">
                          <p className="text-xl">{amount}</p>
                          <p className="text-xl">{selectedToken?.name}</p>
                        </div>
                        <p className="text-xs text-medium">
                          Fee: 1.00 {selectedToken?.name}
                        </p>
                      </div>
                      <div>
                        <Button
                          type={"submit"}
                          kind={"primary"}
                          onClick={handleSubmit(onSubmit)}
                          disabled={isSubmitting || isPending}
                        >
                          <div className="px-10 h-8 flex items-center justify-center">
                            <p>Withdraw</p>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default WithdrawModal;
