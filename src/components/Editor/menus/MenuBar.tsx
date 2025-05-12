import { Editor } from "@tiptap/core";
import React, { useState } from "react";
import { BubbleMenu } from "@tiptap/react";
import { NodeSelector } from "./NodeSelector";
import { BoldIcon } from "lucide-react";
import { TextFormatter } from "./TextFormatter";
import { UndoRedo } from "./UndoRedo";

type Props = {
  editor: Editor;
};

export interface MenuBarItem {
  name: string;
  isActive: () => boolean;
  command: () => void;
  icon: typeof BoldIcon;
}

export const MenuBar: React.FC<Props> = ({ editor }) => {
  const [isNodeSelectorOpen, setIsNodeSelectorOpen] = useState(false);
  return (
    <BubbleMenu editor={editor}>
      <div className="bg-white border rounded-lg border-light shadow-lg">
        <div className="">
          {/* <UndoRedo editor={editor} />
        <NodeSelector
          editor={editor}
          isOpen={isNodeSelectorOpen}
          setIsOpen={setIsNodeSelectorOpen}
        /> */}
          <TextFormatter editor={editor} />
        </div>
      </div>
    </BubbleMenu>
  );
};
