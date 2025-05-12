"use client";

import React, { useEffect, useRef, useState } from "react";
import CreatorPFP from "./ListPost/CreatorPFP";
import { useAuth } from "@/context/auth.context";
import {
  useAccount,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { useDexa } from "@/context/dexa.context";
import useToast from "@/hooks/toast.hook";
import { Controller, FieldValues, useForm } from "react-hook-form";
import { Post } from "@/interfaces/feed.interface";
import Button from "../Form/Button";
import { ImageIcon, SmilePlusIcon } from "lucide-react";
import { GifIcon } from "@heroicons/react/24/outline";
import FileSelector from "../ui/FileSelector";
import PostCounter from "./PostCounter";
import { generateId } from "@/libs/generateId";
import DexaEditor, { DexaEditorHandle } from "../Editor/DexaEditor";

type Props = {
  post: Post;
  refectComments: () => Promise<void>;
};

function NewComment({ post, refectComments }: Props) {
  const editorRef = useRef<DexaEditorHandle>(null);
  const { user } = useAuth();
  const [maxWord] = useState(70);
  const { address } = useAccount();
  const [hash, setHash] = useState<`0x${string}`>();
  const { data } = useWaitForTransactionReceipt({
    confirmations: 2,
    hash,
  });
  const [percentage, setPercentage] = useState(0);
  const [exceededCount, setExceededCount] = useState(0);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const { dexaFeeds, FeedsABI } = useDexa();
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

  useEffect(() => {
    if (data) {
      refectComments();
    }
  }, [data]);

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

  const onSubmit = async (data: FieldValues) => {
    try {
      if (!post) return;
      const commentId = await generateId();

      loading({
        msg: "Posting reply",
      });

      await writeContractAsync(
        {
          abi: FeedsABI,
          address: dexaFeeds,
          functionName: "commentOnPost",
          args: [post.tokenId, commentId, data.content],
        },
        {
          onSuccess: async (data) => {
            setHash(data);
            success({
              msg: "Reply successful",
            });
            resetForm();
          },
          onError(err) {
            error({ msg: `${err.message}` });
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    editorRef.current?.clearEditor();
  };

  return (
    <div>
      <div className="pt-4 flex items-start space-x-3 px-5">
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
        </div>
      </div>
      <div className="flex items-center justify-between px-5 border-t border-light py-2">
        <div className="flex items-center">
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
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {percentage > 100 && (
              <p className="text-xs text-danger">-{exceededCount}</p>
            )}
            <PostCounter showText={false} progress={percentage} />
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            shape={"ROUNDED"}
            kind={"primary"}
            type={"submit"}
            disabled={!isValid || isEmptyContent || isSubmitting}
            size={"SMALL"}
          >
            <p className="text-sm font-semibold">Reply</p>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NewComment;
