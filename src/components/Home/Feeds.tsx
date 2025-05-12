"use client";

import React, { useEffect, useState } from "react";
import ListPost from "../Posts/ListPost/ListPost";
import { Post } from "@/interfaces/feed.interface";
import { useReadContract } from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { timestampToDate, weiToUnit } from "@/libs/helpers";

export const sortPostByDate = (post: Post[]) => {
  return post
    .sort((a, b) => {
      const dateA = timestampToDate(a.createdAt).getTime();
      const dateB = timestampToDate(b.createdAt).getTime();
      return dateB - dateA;
    })
    .map((p: Post) => mapPost(p));
};

export const mapPost = (post: Post) => {
  const {
    createdAt,
    remintPrice,
    tokenId,
    remintCount,
    tipCount,
    remintedPost,
    parentId,
    commentCount,
    ...payload
  } = post;
  return {
    createdAt: timestampToDate(post.createdAt).toISOString(),
    remintPrice: weiToUnit(post.remintPrice).toString(),
    remintCount: Number(post.remintCount).toString(),
    tokenId: Number(post.tokenId).toString(),
    tipCount: Number(post.tipCount).toString(),
    remintedPost: Number(remintedPost).toString(),
    commentCount: Number(post.commentCount),
    parentId: Number(post.parentId),
    ...payload,
  } as Post;
};

function Feeds() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { FeedsABI, dexaFeeds } = useDexa();
  const { data: response, isFetching } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "listOnlyMainPosts",
    args: [],
  });

  useEffect(() => {
    if (response) {
      const _posts = response as Post[];
      const sortedPost = sortPostByDate(_posts).filter((p) => !p.isMintable);
      setPosts(sortedPost);
    }
  }, [response]);

  return (
    <div className="pb-40 lg:pb-10">
      <div className="py-3 border-b border-light cursor-pointer hover:bg-light">
        <p className="text-primary text-center text-sm">Show 98 posts</p>
      </div>
      {posts.map((post: Post, index: number) => (
        <div key={index} className="border-b border-light last:border-none">
          <ListPost post={post} />
        </div>
      ))}
    </div>
  );
}

export default Feeds;
