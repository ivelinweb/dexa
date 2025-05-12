import React, { ForwardedRef, forwardRef } from "react";
import Input from "../Form/Input";

interface FileSelectorProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileSelector = React.forwardRef(
  (
    { onSelect, ...props }: FileSelectorProps,
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <Input
      type={"file"}
      ref={ref}
      onChange={onSelect}
      className="hidden"
      {...props}
    />
  )
);
FileSelector.displayName = "FileSelector";
export default FileSelector;
