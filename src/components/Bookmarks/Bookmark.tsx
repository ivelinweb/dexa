"use client";

import { useDexa } from "@/context/dexa.context";
import { IBookmark } from "@/interfaces/bookmark.interface";
import { Post } from "@/interfaces/feed.interface";
import React, { useEffect, useState } from "react";
import { useReadContract } from "wagmi";
import ListPost from "../Posts/ListPost/ListPost";
import { mapPost } from "../Home/Feeds";

type Props = {
  bookmark: IBookmark;
};

function Bookmark({ bookmark }: Props) {
  const [post, setPost] = useState<Post>();
  const { FeedsABI, dexaFeeds } = useDexa();
  const { data } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "postBygnfdId",
    args: [bookmark.postId],
  });

  useEffect(() => {
    if (data) {
      const mappedPost = mapPost(data as Post);
      setPost(mappedPost);
    }
  }, [data]);

  return <div>{post && <ListPost post={post} />}</div>;
}

export default Bookmark;
