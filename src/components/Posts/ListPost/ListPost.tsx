"use client";

import React, { useState } from "react";
import { Post } from "@/interfaces/feed.interface";
import MintedPost from "./MintedPost";
import RemintedPostLayout from "./RemintedPostLayout";
import TipModal from "../TipModal";
import MintPostModal from "../MintPostModal";

type Props = {
  post: Post;
};

function ListPost({ post }: Props) {
  const [tipModal, setTipModal] = useState<boolean>(false);
  const [mintModal, setMintModal] = useState<boolean>(false);
  return (
    <>
      {post.isReminted ? (
        <RemintedPostLayout post={post} />
      ) : (
        <MintedPost
          post={post}
          setTipModal={setTipModal}
          setRemintModal={setMintModal}
        />
      )}
      {post && <TipModal post={post} open={tipModal} setOpen={setTipModal} />}
      {post && (
        <MintPostModal
          post={post}
          isOpen={mintModal}
          setIsOpen={setMintModal}
        />
      )}
    </>
  );
}

export default ListPost;
