"use client";

import React, { Fragment, useState, useRef, useEffect } from "react";
import { Post } from "@/interfaces/feed.interface";
import { Dialog, Transition } from "@headlessui/react";
import Button from "../Form/Button";
import {
  CalendarPlusIcon,
  ImageIcon,
  ShieldQuestionIcon,
  SmilePlusIcon,
  XIcon,
} from "lucide-react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { useAuth } from "@/context/auth.context";
import CreatorPFP from "./ListPost/CreatorPFP";
import ToggleMintType from "./ToggleMintType";
import RemintedPost from "./ListPost/RemintedPost";
import FileSelector from "../ui/FileSelector";
import PostCounter from "./PostCounter";
import GifIcon from "@heroicons/react/24/outline/GifIcon";
import { Tokens } from "@/config/tokens";
import { toOxString, weiToUnit } from "@/libs/helpers";
import { useDexa } from "@/context/dexa.context";
import {
  useAccount,
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import useToast from "@/hooks/toast.hook";
import { ZeroAddress, ethers } from "ethers";
import { ContractError } from "@/libs/enum";
import { generateId } from "@/libs/generateId";
import DexaEditor, { DexaEditorHandle } from "../Editor/DexaEditor";

const getError = (error: Error): string => {
  const errorMessages: { [key: string]: string } = {
    [ContractError.ERROR_DUPLICATE_RESOURCE]: "Post already reminted",
    [ContractError.ERROR_PROCESS_FAILED]: "Post cannot be reminted",
    [ContractError.ERROR_INVALID_PRICE]: "Insufficient funds",
  };

  const foundMessage = Object.entries(errorMessages).find(([key]) =>
    error.message.includes(key)
  );

  return foundMessage ? foundMessage[1] : "An error occurred";
};

type Props = {
  post?: Post;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function MintPostModal({ post, isOpen, setIsOpen }: Props) {
  const editorRef = useRef<DexaEditorHandle>(null);
  const { user } = useAuth();
  const [maxWord] = useState(70);
  const { address } = useAccount();
  const [percentage, setPercentage] = useState(0);
  const [exceededCount, setExceededCount] = useState(0);
  const [newPostId, setNewPostId] = useState<string>();
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [request, setRequest] = useState<boolean>(false);
  const [requestHash, setRequestHash] = useState<`0x${string}`>();
  const { dexaFeeds, FeedsABI, ERC20ABI } = useDexa();
  const { data: allowance } = useReadContract({
    abi: ERC20ABI,
    functionName: "allowance",
    address: toOxString(post?.remintToken),
    args: [toOxString(address), dexaFeeds],
    query: { enabled: post ? true : false },
  });
  const { writeContractAsync } = useWriteContract();
  const mediaRef = useRef<HTMLInputElement>(null);
  const { loading, success, error } = useToast();
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isValid },
    watch,
  } = useForm();
  const content = watch("content", "");
  const isEmptyContent = content === "<p></p>";
  const token = Tokens.find(
    (t) => t.address.toLowerCase() == post?.remintToken.toLowerCase()
  );

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: requestHash,
    });

  useEffect(() => {
    if (request || !isConfirmed || !requestHash || !newPostId || !post) return;
    (async () => {
      await initRemint(post?.remintToken, content, newPostId);
    })();
  }, [request, isConfirmed, requestHash, newPostId, post]);

  useEffect(() => {
    if (!post?.remintPrice) return;
    const unit = weiToUnit(`${allowance}`);
    const isAllowed = unit >= Number(post.remintPrice);
    setRequest(!isAllowed);
  }, [allowance, post?.remintPrice]);

  const onWordCount = (count: number) => {
    const percentage = (count / maxWord) * 100;
    setPercentage(percentage);
    if (count > maxWord) {
      const excess = count - maxWord;
      setExceededCount(excess);
    }
  };

  const toggleMedia = () => {
    if (mediaRef.current) mediaRef.current.click();
  };

  function closeModal() {
    setIsOpen(false);
  }

  const onSubmit = () => {};

  const onRemint = async (data: FieldValues) => {
    try {
      if (!post) return;
      const postId = await generateId();
      setNewPostId(postId);
      const notNative = request && post?.remintToken != ZeroAddress;
      if (notNative) {
        loading({
          msg: "Requesting permission",
        });
        await writeContractAsync(
          {
            abi: ERC20ABI,
            address: toOxString(post?.remintToken),
            functionName: "approve",
            args: [dexaFeeds, ethers.parseEther(`${post?.remintPrice}`)],
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
      await initRemint(post.remintToken, data.content, postId);
    } catch (error) {
      console.log(error);
    }
  };

  const initRemint = async (
    address: string,
    content: string,
    postId: string
  ) => {
    try {
      const isZero = address == ZeroAddress;
      loading({
        msg: "Reminting...",
      });

      const contractProps: any = {
        abi: FeedsABI,
        address: dexaFeeds,
        functionName: "remintPost",
        args: [post?.tokenId, address, content, postId],
      };
      if (isZero) {
        contractProps.value = ethers.parseEther(`${post?.remintPrice}`);
      }
      await writeContractAsync(
        { ...contractProps },
        {
          onSuccess: async (data) => {
            success({
              msg: "Remint successful",
            });
            resetForm();
            closeModal();
          },
          onError(err) {
            error({ msg: `${err.message}` });
          },
        }
      );
    } catch (err: any) {
      const msg = getError(err);
      error({ msg: `${msg}` });
    }
  };

  const resetForm = () => {
    editorRef.current?.clearEditor();
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
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
            <div className="fixed inset-0 bg-dark/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-start pt-10 justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-4 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg flex top-0 sticky z-20 bg-white justify-between items-center leading-6 m-0 text-dark/80"
                  >
                    <div className="flex items-center gap-x-2">
                      <Button
                        shape={"CIRCLE"}
                        kind="clear"
                        type={"button"}
                        onClick={closeModal}
                        className={"hover:bg-medium/20"}
                      >
                        <XIcon size={22} />
                      </Button>
                      {token && post && (
                        <div className="flex items-center right-0 absolute gap-1">
                          <p className="text-sm font-bold text-medium">Fee:</p>
                          <p className="text-sm text-primary font-semibold">
                            {post.remintPrice}
                          </p>
                          <p className="text-sm">{token?.name}</p>
                          {token && <token.icon />}
                        </div>
                      )}
                    </div>
                  </Dialog.Title>
                  <div className="pt-2 flex items-start space-x-3">
                    <CreatorPFP
                      username={user?.username}
                      name={user?.name}
                      pfp={user?.pfp}
                    />
                    <div className="flex-1 flex flex-col relative">
                      <Controller
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <>
                            <DexaEditor
                              onWordCount={onWordCount}
                              onUpdate={onChange}
                              defaultValue={value}
                              ref={editorRef}
                            />
                          </>
                        )}
                        name={"content"}
                      />
                      {post && (
                        <div className="py-2 select-none">
                          <RemintedPost postItem={post} />
                        </div>
                      )}
                      <div className="py-2">
                        <Controller
                          control={control}
                          render={({ field: { onChange } }) => (
                            <ToggleMintType
                              onSelect={(option) => {
                                onChange(option.id);
                              }}
                            />
                          )}
                          name={"access_level"}
                          defaultValue={"1"}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-light pt-[0.8rem]">
                    <div className="flex items-center">
                      {!post && (
                        <Controller
                          control={control}
                          render={({ field: { onChange, value } }) => (
                            <>
                              <FileSelector
                                onSelect={(ev) => {
                                  if (ev.target.files) {
                                    const file = ev.target.files[0];
                                    setMediaFile(file);
                                    setValue("images", file);
                                    onChange(file);
                                  }
                                }}
                                ref={mediaRef}
                                accept="image/png, image/jpeg"
                              />
                              <Button
                                type={"button"}
                                kind={"default"}
                                shape={"CIRCLE"}
                                onClick={toggleMedia}
                                className="text-primary hover:bg-primary/20"
                                hoverColor={false}
                                title="Media"
                              >
                                <ImageIcon size={18} />
                              </Button>
                            </>
                          )}
                          name={"images"}
                        />
                      )}

                      <Button
                        type={"button"}
                        kind={"default"}
                        shape={"CIRCLE"}
                        className="text-primary hover:bg-primary/20"
                        hoverColor={false}
                        title="GIF"
                      >
                        <GifIcon height={23} />
                      </Button>
                      <Button
                        type={"button"}
                        kind={"default"}
                        shape={"CIRCLE"}
                        className="text-primary hover:bg-primary/20"
                        hoverColor={false}
                        title="Emoji"
                      >
                        <SmilePlusIcon size={18} />
                      </Button>
                      <Button
                        type={"button"}
                        kind={"default"}
                        shape={"CIRCLE"}
                        className="text-primary hover:bg-primary/20 hidden md:flex"
                        hoverColor={false}
                        title="Pool"
                      >
                        <ShieldQuestionIcon size={18} />
                      </Button>
                      <Button
                        type={"button"}
                        kind={"default"}
                        shape={"CIRCLE"}
                        className="text-primary hover:bg-primary/20 hidden md:flex"
                        hoverColor={false}
                        title="Schedule"
                      >
                        <CalendarPlusIcon size={18} />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {percentage > 100 && (
                          <p className="text-xs text-danger">
                            -{exceededCount}
                          </p>
                        )}
                        <PostCounter showText={false} progress={percentage} />
                      </div>

                      <Button
                        onClick={handleSubmit(post ? onRemint : onSubmit)}
                        shape={"ROUNDED"}
                        kind={"primary"}
                        type={"submit"}
                        disabled={!isValid || isEmptyContent || isSubmitting}
                        size={"SMALL"}
                      >
                        <p className="text-sm font-semibold">
                          {post ? "Remint" : "Mint"}
                        </p>
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
