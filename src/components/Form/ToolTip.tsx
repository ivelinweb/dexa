import clsx from "clsx";
import React, { useRef, useState, ReactNode } from "react";
export interface TooltipInterface {
  children: ReactNode;
  tooltipText: string;
  position?: "LEFT" | "RIGHT" | "TOP" | "BOTTOM";
}

export default function Tooltip({
  children,
  tooltipText,
  position = "LEFT",
}: TooltipInterface) {
  const tipRef = useRef<any>();
  const [isTooltipOn, setIsTooltipOn] = useState<boolean>(false);
  function handleMouseEnter() {
    setIsTooltipOn(true);
  }
  function handleMouseLeave() {
    setIsTooltipOn(false);
  }
  return (
    <div className="relative flex items-center">
      <div
        className={clsx(
          `absolute whitespace-no-wrap flex items-center transition-all duration-150 w-[12rem]`,
          {
            "left-full ml-3 opacity-100": position === "LEFT" && isTooltipOn,
            "left-full ml-0 opacity-0": position === "LEFT" && !isTooltipOn,
            "right-full mr-3 opacity-100": position === "RIGHT" && isTooltipOn,
            "right-full mr-0 opacity-0": position === "RIGHT" && !isTooltipOn,
            "bottom-full mb-3 -left-2 opacity-100":
              position === "TOP" && isTooltipOn,
            "bottom-full mb-0 -left-5 opacity-0":
              position === "TOP" && !isTooltipOn,
            "top-full mt-3 -left-2 opacity-100":
              position === "BOTTOM" && isTooltipOn,
            "top-full mt-0 -left-5 opacity-0":
              position === "BOTTOM" && !isTooltipOn,
            "opacity-100": isTooltipOn,
            "opacity-0 m-0": !isTooltipOn,
          }
        )}
        ref={tipRef}
      >
        <div
          className={clsx(`bg-white h-3 w-3 absolute rotate-45`, {
            "-left-[6px]": position === "LEFT",
            "-right-[6px]": position === "RIGHT",
            "-bottom-1 left-3": position === "TOP",
            "-top-1 left-3": position === "BOTTOM",
          })}
        />
        <div className="w-auto bg-white shadow-md font-light text-sm text-medium px-2 py-1 rounded">
          {tooltipText}
        </div>
      </div>
      <p
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="bg-medium h-[1.1rem] w-[1.1rem] z-[1] text-light text-xs cursor-pointer flex items-center justify-center rounded-full bg-opacity-80"
      >
        {children}
      </p>
    </div>
  );
}
