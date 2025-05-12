import { Post } from "@/interfaces/feed.interface";
import React, { useEffect, useState } from "react";
import CreatorPFP from "./CreatorPFP";
import CreatorName from "./CreatorName";
import Image from "next/image";
import ShowMore from "../ShowMore";
import { useDexa } from "@/context/dexa.context";
import { useReadContract } from "wagmi";
import { mapPost } from "@/components/Home/Feeds";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux.hook";
import { selectPost } from "@/slices/posts/post-selected.slice";
import { routes } from "@/libs/routes";
type Props = {
  postId?: string;
  postItem?: Post;
};
function RemintedPost({ postId, postItem }: Props) {
  const [post, setPost] = useState<Post | undefined>(postItem);
  const { FeedsABI, dexaFeeds } = useDexa();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: response } = useReadContract({
    abi: FeedsABI,
    address: dexaFeeds,
    functionName: "getPost",
    args: [`${postId}`],
    query: {
      enabled: postId ? true : false,
    },
  });

  useEffect(() => {
    if (response) {
      const data = response as Post;
      const postData = mapPost(data);
      setPost(postData);
    }
  }, [response]);

  useEffect(() => {
    router.prefetch(routes.app.mints(`${post?.id}`));
  }, [post]);

  const postDetails = () => {
    if (post) {
      router.push(routes.app.mints(post.id));
      dispatch(selectPost(post));
    }
  };

  return (
    <div
      role="button"
      onClick={(e) => {
        postDetails();
        e.stopPropagation();
      }}
      className="hover:bg-light cursor-pointer border border-medium/30 rounded-2xl pt-3"
    >
      <div className="flex gap-x-2 items-center px-3">
        <CreatorPFP
          username={post?.creator.username}
          name={post?.creator.name}
          pfp={post?.creator.pfp}
        />
        <CreatorName
          name={post?.creator.name}
          username={post?.creator.username}
          createdAt={post?.createdAt}
        />
      </div>
      <div>
        <div className="px-3">
          {post && post.content && (
            <div className="mt-2">
              <ShowMore
                onClick={postDetails}
                data={post.content}
                isShowMore={true}
              />
            </div>
          )}
        </div>
        {post?.media &&
          post.media.map((media, index) => (
            <div
              key={index}
              className="pt-2 rounded-xl border border-light max-h-[35rem] overflow-hidden"
            >
              <Image
                key={index}
                src={media.url}
                height={400}
                width={600}
                alt={post.id}
                priority={true}
                className="size-full"
                blurDataURL="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default RemintedPost;
