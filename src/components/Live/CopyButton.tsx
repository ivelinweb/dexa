import useClipBoard from "@/hooks/clipboard.hook";
import { CopyIcon, CopyPlusIcon } from "lucide-react";
import React from "react";
import Button from "../Form/Button";
type Props = {
  value: string;
};
function CopyButton({ value }: Props) {
  const { copy, isCopied } = useClipBoard();
  return (
    <Button
      disabled={isCopied || !value}
      type="button"
      kind="clear"
      onClick={() => copy(value)}
      className="flex text-primary items-center gap-x-2 px-3"
    >
      {isCopied ? <CopyPlusIcon size={20} /> : <CopyIcon size={20} />}
      <p className=" font-semibold">{isCopied ? "Copied" : "Copy"}</p>
    </Button>
  );
}

export default CopyButton;
