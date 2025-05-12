import React from "react";
import Button from "@/components/Form/Button";
import { useDexa } from "@/context/dexa.context";
import { Post } from "@/interfaces/feed.interface";
import { ThumbsUpIcon } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";

type Props = {
  post: Post;
};

function LikeButton({ post }: Props) {
  const { address } = useAccount();
  const isLiked = post.likedBy.includes(`${address}`);
  const { writeContractAsync } = useWriteContract();
  const { FeedsABI, dexaFeeds } = useDexa();

  const prevent = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
  };

  const likePost = async () => {
    try {
      await writeContractAsync(
        {
          abi: FeedsABI,
          address: dexaFeeds,
          functionName: "likePost",
          args: [post.tokenId],
        },
        {
          onSuccess: (data) => {
            post.likedBy.push(`${address}`);
          },
        }
      );
    } catch (error) {}
  };

  return (
    <>
      <Button
        type={"button"}
        kind={"clear"}
        shape={"CIRCLE"}
        onClick={(e) => {
          prevent(e);
          likePost();
        }}
        className={`text-dark ${
          isLiked ? "text-primary" : "bg-white"
        }  group-hover:text-primary group-hover:bg-primary/20`}
        hoverColor={false}
        title="Like"
      >
        <ThumbsUpIcon size={18} />
      </Button>
      {post.likedBy.length > 0 && (
        <p
          className={`text-sm group-hover:text-primary ${
            isLiked ? "text-primary" : ""
          }`}
        >
          {post.likedBy.length}
        </p>
      )}
    </>
  );
}

export default LikeButton;
