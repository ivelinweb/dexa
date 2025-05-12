"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import Button from "../Form/Button";
import Label from "../Form/Label";
import Tooltip from "../Form/ToolTip";
import Input from "../Form/Input";
import { useForm, Controller, FieldValues, useWatch } from "react-hook-form";
import { Coin, Post } from "@/interfaces/feed.interface";
import { UnfoldVerticalIcon } from "lucide-react";
import SelectTipCoin from "./SelectTipCoin";
import { tipResolver } from "@/schemas/tip-post.schema";
import ShowError from "../Form/ShowError";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { ZeroAddress, ethers } from "ethers";
import { toOxString, walletToLowercase, weiToUnit } from "@/libs/helpers";
import useToast from "@/hooks/toast.hook";

type Props = {
  post: Post;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function TipModal({ post, open, setOpen }: Props) {
  const {
    reset,
    control,
    resetField,
    handleSubmit,
    formState: { errors, isDirty, isSubmitting },
  } = useForm({ ...tipResolver });
  const { loading, error, success } = useToast();
  const [currency, setCurrency] = useState<Coin>();
  const [price, setPrice] = useState<string>("0.00");
  const [creatorAmt, setCreatorAmt] = useState<string>("0.00");
  const [serviceAmt, setServiceAmt] = useState<string>("0.00");
  const [request, setRequest] = useState<boolean>(false);
  const [requestHash, setRequestHash] = useState<`0x${string}`>();
  const { address } = useAccount();
  const { FeedsABI, dexaFeeds, ERC20ABI } = useDexa();
  const amount = useWatch({ control, name: "amount" });
  const { writeContractAsync, isPending } = useWriteContract();
  const { data: allowance } = useReadContract({
    abi: ERC20ABI,
    functionName: "allowance",
    address: toOxString(currency?.address),
    args: [toOxString(address), dexaFeeds],
    scopeKey: currency?.address,
  });
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: requestHash,
    });

  useEffect(() => {
    if (request || !isConfirmed || !amount || !currency || !requestHash) return;
    (async () => {
      tipPost(currency.address, amount);
    })();
  }, [request, isConfirmed, amount, currency, requestHash]);

  useEffect(() => {
    if (!amount) return;
    const unit = weiToUnit(`${allowance}`);
    const isAllowed = unit >= Number(amount);
    setRequest(!isAllowed);
  }, [allowance, amount]);

  function closeModal() {
    setOpen(false);
  }

  const handleFees = (value: string) => {
    const amt = Number(value);
    const serviceCharge = (amt * 3) / 100;
    const creatorAmt = amt - serviceCharge;
    setCreatorAmt(creatorAmt.toString());
    setServiceAmt(serviceCharge.toString());
  };

  const onSubmit = async (payload: FieldValues) => {
    if (!currency) return;
    try {
      const isReq = request && currency.address != ZeroAddress;
      if (isReq) {
        loading({
          msg: "Requesting permission",
        });
        await writeContractAsync(
          {
            abi: ERC20ABI,
            address: toOxString(currency.address),
            functionName: "approve",
            args: [dexaFeeds, ethers.parseEther(payload.amount)],
          },
          {
            onSuccess: async (data) => {
              success({ msg: "Permission granted" });
              setRequest(false);
              setRequestHash(data);
            },
          }
        );
        return;
      }
      await tipPost(currency.address, payload.amount);
    } catch (err) {
      if (err instanceof Error) {
        error({ msg: err.message });
      }
      if (err && typeof err === "object") {
        error({ msg: JSON.stringify(err) });
      }
    }
  };

  const tipPost = async (address: string, amount: string) => {
    try {
      const isZero = address == ZeroAddress;
      loading({
        msg: "Sending tip",
      });
      const contractProps: any = {
        abi: FeedsABI,
        address: dexaFeeds,
        functionName: "tipPost",
        args: [
          Number(post.tokenId),
          "Thank you",
          address,
          ethers.parseEther(amount),
        ],
      };
      if (isZero) {
        contractProps.value = ethers.parseEther(amount);
      }
      await writeContractAsync(
        { ...contractProps },
        {
          onSuccess: async (data) => {
            success({
              msg: "Tip sent",
            });
            resetForm();
            closeModal();
          },
          onError(err) {
            console.log(err);
            error({ msg: `${err.message}` });
          },
        }
      );
    } catch (err: any) {
      if (err instanceof Error) {
        error({ msg: `${err.message}` });
      }
      if (err && typeof err === "object") {
        error({ msg: JSON.stringify(err) });
      }
    }
  };

  const resetForm = () => {
    resetField("amount", undefined);
    resetField("currency", undefined);
    setServiceAmt("0.00");
    setCreatorAmt("0.00");
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-dark/40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden text-left align-middle transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="w-full h-full flex flex-col gap-10">
                    <div className="bg-light rounded-2xl overflow-hidden shadow-xl">
                      <div className="bg-primary/25 px-6 pt-5 pb-10 relative">
                        <div className="flex items-center gap-2 mb-6">
                          <p className="font-bold text-lg text-dark">
                            Tip Feed #{Number(post.tokenId)}
                          </p>
                        </div>

                        <>
                          <div className="flex items-end gap-2 mb-2">
                            <Label title="Set Price" isRequired={true} />
                            <Tooltip
                              position={"TOP"}
                              tooltipText="How much do you want to tip?"
                            >
                              ?
                            </Tooltip>
                          </div>
                          <div className="flex items-center outline-primary rounded-lg overflow-hidden bg-white">
                            <Controller
                              control={control}
                              render={({ field: { onChange, value } }) => (
                                <div className="px-3 flex items-center">
                                  <SelectTipCoin
                                    onSelect={(value) => {
                                      setCurrency(value);
                                      onChange(value.address);
                                    }}
                                  />
                                </div>
                              )}
                              name={"currency"}
                            />

                            <Controller
                              control={control}
                              name={"amount"}
                              render={({ field: { onChange, value } }) => (
                                <Input
                                  type={"text"}
                                  className="text-xl font-semibold px-0"
                                  isOutline={false}
                                  onChange={(e) => {
                                    onChange(e);
                                    setPrice(e.target.value);
                                    handleFees(e.target.value);
                                  }}
                                  placeholder="0.00"
                                />
                              )}
                            />
                          </div>
                          {errors.amount && (
                            <ShowError error={errors.amount.message} />
                          )}
                        </>

                        <div className="flex items-start justify-between font-medium text-sm mt-2 text-neutral-600">
                          <p>$ 0.00</p>
                          <div className="text-right">
                            <p>Tipping price</p>
                            <p className="text-main font-bold">
                              {price} {currency?.name}
                            </p>
                          </div>
                        </div>
                        <div className="absolute w-full -bottom-6 left-0">
                          <div className="flex justify-center">
                            <div className="h-12 w-12 rounded-full flex items-center justify-center bg-primary text-light">
                              <UnfoldVerticalIcon size={25} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-6 pt-10 pb-6 flex flex-col gap-2">
                        <div className="text-sm flex justify-between items-center gap-5s">
                          <p>Creator receives</p>
                          <p className="flex items-center gap-1">
                            {creatorAmt} {currency?.name}{" "}
                            {currency && <currency.icon />}
                          </p>
                        </div>
                        <div className="text-sm flex justify-between items-center gap-5s">
                          <p>Service fee (3%)</p>
                          <p className="flex items-center gap-1">
                            {serviceAmt} {currency?.name}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center shadow-2xl">
                      <Button
                        onClick={handleSubmit(onSubmit)}
                        type={"button"}
                        kind={"primary"}
                        className="w-full h-12"
                        size={"LARGE"}
                        shape={"ROUNDED"}
                        disabled={isSubmitting || isConfirming || isPending}
                      >
                        Send Tip
                      </Button>
                    </div>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
