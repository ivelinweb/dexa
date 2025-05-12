import React from "react";

const buttonKind = {
  clear: {
    enabled: "",
    disabled: "",
    hover: "",
  },
  default: {
    enabled: "bg-white text-dark",
    disabled: "bg-white/20 text-dark cursor-not-allowed",
    hover: "hover:bg-white/90",
  },
  error: {
    enabled: "bg-danger text-white",
    disabled: "bg-danger/20 text-white cursor-not-allowed",
    hover: "hover:bg-danger/90",
  },
  primary: {
    enabled: "bg-primary text-white",
    disabled: "bg-primary/20 text-white cursor-not-allowed",
    hover: "hover:bg-primary/90",
  },
  dark: {
    enabled: "bg-dark text-white",
    disabled: "bg-dark/20 text-white cursor-not-allowed",
    hover: "hover:bg-dark/90",
  },
};

const btnShape = {
  NORMAL: "rounded-sm py-[0.45rem] px-5",
  CIRCLE: "rounded-full h-9 w-9 flex items-center justify-center",
  ROUNDED: "rounded-3xl py-[0.45rem] px-5",
};

export default function Button({
  kind,
  className,
  size = "NORMAL",
  shape = "NORMAL",
  outline = false,
  hoverColor = true,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  kind: "default" | "error" | "primary" | "dark" | "clear";
  size?: "SMALL" | "NORMAL" | "LARGE";
  shape?: "NORMAL" | "CIRCLE" | "ROUNDED";
  className?: string;
  outline?: boolean;
  hoverColor?: boolean;
}) {
  const kindClass = props.disabled
    ? buttonKind[kind].disabled
    : buttonKind[kind].enabled;

  const shapeClass = btnShape[shape];
  const hoverClass =
    hoverColor && !props.disabled ? buttonKind[kind].hover : "";

  return (
    <button
      type={props.type}
      onClick={props.onClick}
      className={`transition-all duration-500 ${kindClass} ${shapeClass} ${hoverClass} ${className}`}
      {...props}
    />
  );
}
