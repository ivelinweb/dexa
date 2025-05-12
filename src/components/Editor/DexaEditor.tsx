import React, {
  useEffect,
  useState,
  useImperativeHandle,
  ForwardedRef,
} from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { defaultEditorProps } from "./props";
import { defaultExtensions } from "./extensions";
import { MenuBar } from "./menus/MenuBar";

export interface DexaEditorHandle {
  clearEditor: () => void;
}

type Props = {
  onUpdate: (value: string) => void;
  onWordCount: (value: number) => void;
  defaultValue?: string;
};

const DexaEditor = React.forwardRef(
  (
    { onUpdate, defaultValue, onWordCount }: Props,
    ref: ForwardedRef<DexaEditorHandle>
  ) => {
    const [hydrated, setHydrated] = useState(false);
    const [wordCount, setWordCount] = useState<number>(0);

    const editor = useEditor({
      content: defaultValue,
      extensions: [...defaultExtensions],
      editorProps: {
        ...defaultEditorProps,
      },
      onUpdate: (event) => {
        onUpdate(event.editor.getHTML());
        const words = countWords(event.editor.getText());
        onWordCount(words);
      },
    });

    useImperativeHandle(ref, () => ({
      clearEditor: () => {
        if (editor) {
          editor.commands.clearContent();
        }
      },
    }));

    useEffect(() => {
      if (!editor || hydrated) return;
      if (defaultValue) {
        editor.commands.setContent(defaultValue);
        countWords(editor.getText());
        setHydrated(true);
      }
    }, [editor, defaultValue, hydrated]);

    const countWords = (sentence: string) => {
      const trimmedSentence = sentence.trim();
      const wordsArray = trimmedSentence.split(/\s+/);
      const nonEmptyWordsArray = wordsArray.filter((word) => word !== "");
      const length = trimmedSentence === "" ? 0 : nonEmptyWordsArray.length;
      setWordCount(length);
      return length;
    };

    return (
      <div
        onClick={() => {
          editor?.chain().focus().run();
        }}
        className="flex flex-col cursor-text min-h-[4rem] max-h-[20rem] overflow-hidden"
      >
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {editor && <MenuBar editor={editor} />}
          <div className="flex-1 overflow-y-scroll scrollbar-hide">
            <EditorContent
              onFocus={() => {
                console.log("focused");
              }}
              editor={editor}
            />
          </div>
        </div>
      </div>
    );
  }
);
DexaEditor.displayName = "DexaEditor";
export default DexaEditor;
