"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BadgeCheck,
  EllipsisIcon,
  HandCoinsIcon,
  TrendingDownIcon,
} from "lucide-react";
import Button from "../Form/Button";
import ShowMore from "./ShowMore";
import PostsComment from "./PostsComments";
import { Post } from "@/interfaces/feed.interface";
import Moment from "react-moment";
import TipModal from "./TipModal";
import { walletToLowercase } from "@/libs/helpers";
import { useAccount, useReadContract } from "wagmi";
import CreatorPFP from "./ListPost/CreatorPFP";
import LikeButton from "./PostButtons/LikeButton";
import CommentButton from "./PostButtons/CommentButton";
import ShareButton from "./PostButtons/ShareButton";
import BookmarkButton from "./PostButtons/BookmarkButton";
import { useAppSelector } from "@/hooks/redux.hook";
import { selectedPost } from "@/slices/posts/post-selected.slice";
import { useDexa } from "@/context/dexa.context";
import { mapPost } from "../Home/Feeds";
import { Diamond } from "../Icons/Others";
import MintPostModal from "./MintPostModal";
import RemintedPost from "./ListPost/RemintedPost";
import { routes } from "@/libs/routes";
import { useSearchParams } from "next/navigation";

function PostDetails() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const { address } = useAccount();
  const [tipModal, setTipModal] = useState<boolean>(false);
  const [mintModal, setMintModal] = useState<boolean>(false);
  const _post = useAppSelector(selectedPost);
  const { FeedsABI, dexaFeeds } = useDexa();
  const { data } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "postBygnfdId",
    args: [`${id}`],
  });
  const [post, setPost] = useState<Post | undefined>(_post);

  useEffect(() => {
    if (data) {
      const content = data as Post;
      const mapData = mapPost(content);
      setPost(mapData);
    }
  }, [data]);

  return (
    <div className="pb-40 lg:pb-10">
      <div className="flex items-center justify-between px-5">
        <div className="flex items-center space-x-2">
          <CreatorPFP
            pfp={post?.creator.pfp}
            name={post?.creator.name}
            username={post?.creator.username}
          />
          <div className="flex flex-col">
            <Link
              href={routes.app.profile(`${post?.creator.username}`)}
              className="flex items-center space-x-1"
            >
              <p className="font-semibold text-sm capitalize text-dark">
                {post?.creator.name}
              </p>
              <BadgeCheck size={18} className="fill-primary stroke-white" />
            </Link>
            <Link
              href={routes.app.profile(`${post?.creator.username}`)}
              className="text-xs text-medium"
            >
              @{post?.creator.username}
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-x-2">
          <div className="flex items-center bg-danger/20 py-1 px-3 space-x-1 rounded-sm">
            <TrendingDownIcon size={18} className="text-danger" />
            <p className="text-danger font-semibold text-sm text-right">
              Bearish
            </p>
          </div>
          <Button
            type={"button"}
            kind={"default"}
            shape={"CIRCLE"}
            className="hover:bg-primary/20 hover:text-primary"
            hoverColor={false}
            title="Media"
          >
            <EllipsisIcon size={18} />
          </Button>
        </div>
      </div>
      {post && (
        <div className="mt-2 px-5">
          <ShowMore data={post.content} />
          <div className="rounded-xl mt-2 border border-light overflow-auto">
            {post?.media.map((media, index) => (
              <Image
                key={index}
                src={media.url}
                height={500}
                width={1000}
                alt={post.id}
              />
            ))}
          </div>
        </div>
      )}

      {post?.isReminted && (
        <div className="px-5 pt-5">
          <RemintedPost postId={post.remintedPost} />
        </div>
      )}

      {post &&
        walletToLowercase(`${post.creator.id}`) !=
          walletToLowercase(`${address}`) && (
          <div className="px-5 text-center pt-5">
            <div className="flex items-center justify-center space-x-1 group">
              <Button
                onClick={() => setTipModal(true)}
                type={"button"}
                kind={"primary"}
                shape={"ROUNDED"}
                className="rounded-lg px-3"
                title="Tip"
              >
                <div className="flex items-center space-x-1">
                  <HandCoinsIcon height={18} />
                  <p className="text-xs">Give a Tip</p>
                </div>
              </Button>
            </div>
            {Number(post.tipCount) > 0 && (
              <p className="text-xs text-medium mt-2">
                {post.tipCount}{" "}
                {Number(post.tipCount) > 1 ? `people` : `person`} tippped the
                creator.
              </p>
            )}
          </div>
        )}

      <div className="mb-3 pt-5 px-5">
        <div className="flex items-center justify-between space-x-1">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2">
            <p className="text-sm text-medium">
              <Moment format="hh:mm A · MMM D, YYYY">{post?.createdAt}</Moment>
            </p>
            <p className="text-sm text-medium">
              <span className="font-semibold">1,191</span> Views
            </p>
          </div>
          {Number(post?.remintPrice) > 0 && (
            <div className="flex items-center gap-x-2">
              {post?.remintedBy && post.remintedBy.length > 0 && (
                <p className="text-primary text-sm">
                  {post.remintedBy.length} Reminted
                </p>
              )}
              <Button
                onClick={() => setMintModal(true)}
                type={"button"}
                kind={"primary"}
                shape={"CIRCLE"}
                title="Tip"
              >
                <Diamond />
              </Button>
            </div>
          )}
        </div>
      </div>

      {post && (
        <div className="py-2 flex px-5 items-center justify-between border-y border-light">
          <div className="flex items-center space-x-1 group">
            <CommentButton post={post} />
          </div>
          <div className="flex items-center space-x-1 group">
            <LikeButton post={post} />
          </div>
          <div className="flex items-center space-x-1 group">
            <ShareButton post={post} />
          </div>
          <div className="flex items-center space-x-1 group">
            <BookmarkButton post={post} />
          </div>
        </div>
      )}

      {post && (
        <div>
          <PostsComment post={post} />
        </div>
      )}
      {post && <TipModal post={post} open={tipModal} setOpen={setTipModal} />}
      {post && (
        <MintPostModal
          post={post}
          isOpen={mintModal}
          setIsOpen={setMintModal}
        />
      )}
    </div>
  );
}

export default PostDetails;
