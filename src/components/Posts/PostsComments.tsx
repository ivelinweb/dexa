"use client";

import React, { useEffect, useState } from "react";
import ListPost from "./ListPost/ListPost";
import { Post } from "@/interfaces/feed.interface";
import NewComment from "./NewComment";
import { useReadContract } from "wagmi";
import { useDexa } from "@/context/dexa.context";
import { sortPostByDate } from "../Home/Feeds";
import { QueryKeys } from "@/libs/enum";

type Props = {
  post: Post;
};

function PostsComment({ post }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const { dexaFeeds, FeedsABI } = useDexa();
  const { data, refetch } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "getComments",
    args: [post.tokenId],
    scopeKey: QueryKeys.COMMENTS,
    query: { enabled: post ? true : false },
  });

  useEffect(() => {
    if (data) {
      const postArr = data as Post[];
      const sortedPost = sortPostByDate(postArr);
      setPosts(sortedPost);
    }
  }, [data]);

  const refetchComments = async () => {
    const response = await refetch();
    const postArr = response.data as Post[];
    const sortedPost = sortPostByDate(postArr);
    setPosts(sortedPost);
  };

  return (
    <div className="mb-20">
      <div className="border-b border-light">
        <NewComment post={post} refectComments={refetchComments} />
      </div>
      {posts.map((post, index) => (
        <div key={index} className="border-b border-light last:border-none">
          <ListPost post={post} />
        </div>
      ))}
    </div>
  );
}

export default PostsComment;
