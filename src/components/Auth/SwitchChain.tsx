import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux.hook";
import {
  selectSwitchChain,
  setSwitchChain,
} from "@/slices/account/switch-chain.slice";
import { useSwitchChain } from "wagmi";
import Button from "../Form/Button";
import { useAuth } from "@/context/auth.context";
import { PHAROS_CHAIN_ID } from "@/config/env";

function SwitchChain() {
  const isSwitch = useAppSelector(selectSwitchChain);
  const dispatch = useAppDispatch();
  const { switchChainAsync, chains } = useSwitchChain();
  const { logout } = useAuth();

  const initSwitch = async () => {
    await switchChainAsync({ chainId: PHAROS_CHAIN_ID });
  };

  const disconnect = () => {
    dispatch(setSwitchChain(false));
    logout();
  };

  return (
    <Transition appear show={isSwitch} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-50 overflow-y-auto"
        onClose={() => setSwitchChain(false)}
      >
        <div className="min-h-screen px-4 text-center bg-dark/50">
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
            className="inline-block h-screen align-middle bg-primary"
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
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all dark:border dark:border-gray-600 transform bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
              <Dialog.Title
                as="h3"
                className="text-lg flex justify-between items-center font-medium leading-6 dark:text-gray-100 text-gray-900"
              >
                Switch Network
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm mb-2 text-dark/50 dark:text-gray-300">
                  To continue using Dexa, you need to switch to Pharos Testnet. Click
                  the button below to switch
                </p>
              </div>

              <div className="mt-4 flex space-x-2">
                <Button type={"button"} kind={"primary"} onClick={initSwitch}>
                  <p className="text-sm">Switch Network</p>
                </Button>
                <Button
                  type={"button"}
                  kind={"default"}
                  className="border border-medium"
                  onClick={disconnect}
                >
                  <p className="text-sm">Disconnect</p>
                </Button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default SwitchChain;
