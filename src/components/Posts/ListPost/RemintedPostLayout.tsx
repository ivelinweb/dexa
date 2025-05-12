"use client";

import React, { useEffect, useState } from "react";
import { EllipsisIcon } from "lucide-react";
import Button from "../../Form/Button";
import ShowMore from "../ShowMore";
import { Post } from "@/interfaces/feed.interface";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux.hook";
import { selectPost } from "@/slices/posts/post-selected.slice";
import TipModal from "../TipModal";
import CreatorPFP from "../ListPost/CreatorPFP";
import CreatorName from "./CreatorName";
import RemintedPost from "./RemintedPost";
import PostButtons from "../PostButtons/PostButtons";
import { routes } from "@/libs/routes";

type Props = {
  post: Post;
};
function RemintedPostLayout({ post }: Props) {
  const [tipModal, setTipModal] = useState<boolean>(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    router.prefetch(routes.app.mints(post.id));
  }, []);

  const postDetails = () => {
    router.push(routes.app.mints(post.id));
    dispatch(selectPost(post));
  };

  const prevent = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };
  return (
    <>
      <div
        onClick={postDetails}
        className="hover:bg-light/50 cursor-pointer px-5 pb-2 pt-5"
      >
        <div className="flex items-start space-x-3">
          <div className="min-w-[2.5rem] sticky top-0 flex flex-col gap-3 items-center">
            <CreatorPFP
              username={post.creator.username}
              name={post.creator.name}
              pfp={post.creator.pfp}
            />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <CreatorName
                name={post.creator.name}
                username={post.creator.username}
                createdAt={post.createdAt}
              />
              <div>
                <Button
                  type={"button"}
                  kind={"default"}
                  shape={"CIRCLE"}
                  className="hover:bg-primary/20 hover:text-primary"
                  hoverColor={false}
                  title="More"
                  onClick={prevent}
                >
                  <EllipsisIcon size={18} />
                </Button>
              </div>
            </div>

            {post && post.content && (
              <div className="mt-2">
                <ShowMore
                  onClick={postDetails}
                  data={post.content}
                  isShowMore={true}
                />
              </div>
            )}

            <div className="my-2">
              <RemintedPost postId={post.remintedPost} />
            </div>

            <PostButtons setTipModal={setTipModal} post={post} />
          </div>
        </div>
      </div>
      {post && <TipModal post={post} open={tipModal} setOpen={setTipModal} />}
    </>
  );
}

export default RemintedPostLayout;
