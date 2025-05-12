import React, { ForwardedRef, forwardRef } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {}

const TextArea = React.forwardRef(
  ({ className, ...props }: Props, ref: ForwardedRef<HTMLTextAreaElement>) => (
    <textarea
      ref={ref}
      className={`w-full px-4 ${className} text-base outline-primary`}
      {...props}
    ></textarea>
  )
);
TextArea.displayName = "TextArea";
export default TextArea;
