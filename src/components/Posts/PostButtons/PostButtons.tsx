import React from "react";
import { Post } from "@/interfaces/feed.interface";
import LikeButton from "./LikeButton";
import CommentButton from "./CommentButton";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import TipButton from "./TipButton";

type Props = {
  post: Post;
  setTipModal: (value: React.SetStateAction<boolean>) => void;
};

function PostButtons({ post, setTipModal }: Props) {
  return (
    <>
      {post.isMintable ? (
        <div className="py-2 flex px-5 items-center justify-between">
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
      ) : (
        <div className="pt-2 flex items-center justify-between">
          <div className="flex items-center space-x-1 group">
            <TipButton post={post} setTipModal={setTipModal} />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-4 lg:space-x-6">
              <div className="flex items-center space-x-1 group">
                <CommentButton post={post} />
              </div>
              <div className="flex items-center space-x-1 group">
                <LikeButton post={post} />
              </div>
              <div className="hidden md:flex items-center space-x-1 group">
                <ShareButton post={post} />
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <div className="flex items-center space-x-1 group">
                <BookmarkButton post={post} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default PostButtons;
