import React from "react";
import Button from "@/components/Form/Button";
import { Post } from "@/interfaces/feed.interface";
import { MessageSquareTextIcon } from "lucide-react";

type Props = {
  post: Post;
};
function CommentButton({ post }: Props) {
  return (
    <>
      <Button
        type={"button"}
        kind={"default"}
        shape={"CIRCLE"}
        className="text-dark group-hover:text-primary group-hover:bg-primary/20"
        hoverColor={false}
        onClick={(e) => {
          e.stopPropagation();
        }}
        title="Comments"
      >
        <MessageSquareTextIcon size={18} />
      </Button>
      {post.commentCount > 0 && (
        <p className="text-sm group-hover:text-primary">{post.commentCount}</p>
      )}
    </>
  );
}

export default CommentButton;
