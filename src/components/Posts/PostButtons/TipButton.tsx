import React from "react";
import Button from "@/components/Form/Button";
import { Post } from "@/interfaces/feed.interface";
import { HandCoinsIcon } from "lucide-react";

type Props = {
  post: Post;
  setTipModal: (value: React.SetStateAction<boolean>) => void;
};

function TipButton({ post, setTipModal }: Props) {
  return (
    <Button
      type={"button"}
      kind={"default"}
      shape={"CIRCLE"}
      className="text-dark group-hover:text-primary group-hover:bg-primary/20"
      hoverColor={false}
      onClick={(e) => {
        setTipModal(true);
        e.stopPropagation();
      }}
      title="Tip"
    >
      <HandCoinsIcon size={18} />
    </Button>
  );
}

export default TipButton;
