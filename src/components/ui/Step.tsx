"use client"

import React, {
  MutableRefObject,
  ReactElement,
  useEffect,
  useState,
} from "react";
import clsx from "clsx";
import { StepperInterface } from "@/interfaces/stepper.interface";
import { LucideIcon } from "lucide-react";

interface StepsInterface {
  index: number;
  selected: boolean;
  activeStep: number;
  label: {
    icons: LucideIcon;
    title: string;
  };
  updateStep: Function;
  size?: "SMALL" | "MEDIUM";
  position?: "LEFT" | "CENTER";
}

export function Steps({
  selected,
  activeStep,
  updateStep,
  index,
  label,
  size = "SMALL",
  position,
}: StepsInterface) {
  const isCompleted = activeStep > index + 1;
  const isSmall = size === "SMALL";
  return (
    <div
      className={clsx("steps", {
        completed: isCompleted,
        selected: selected,
        "steps-small": isSmall,
        "step-left": position === "LEFT",
        "step-center": position === "CENTER",
      })}
    >
      <div
        className={clsx(`circle-wrapper relative`)}
        onClick={() => {
          if (activeStep >= index + 1) {
            updateStep(index + 1);
          }
        }}
      >
        <div
          className={clsx(
            `circle bg-light text-primary rounded-full border-2 border-medium flex justify-center items-center text-2xl z-10 relative cursor-pointer transition-all duration-500`,
            {
              "bg-primary text-light border-primary":
                isCompleted || selected,
              "h-10 w-10": isSmall,
              "h-12 w-12": !isSmall,
            }
          )}
        >
          <label.icons
            size={18}
            className={clsx("text-medium", { "text-white": isCompleted || selected })}
          />
        </div>
      </div>
      <span
        className={clsx(`font-normal text-lg text-primary`, {
          block: isCompleted || selected,
          hidden: !isCompleted && !selected,
          "text-lg": !isSmall,
          "text-sm": isSmall,
          "text-left": position === "LEFT",
          "text-center": position === "CENTER",
        })}
      >
        {label.title}
      </span>
    </div>
  );
}

export function StepsNavigation({
  steps,
  activeStep,
  updateStep,
  className,
  size = "SMALL",
  scrollPos,
  scrollRef,
  position,
}: {
  steps: StepperInterface[];
  activeStep: number;
  updateStep: Function;
  className?: string;
  size?: "SMALL" | "MEDIUM";
  scrollRef?: MutableRefObject<any>;
  scrollPos?: number;
  position?: "LEFT" | "CENTER";
}) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const changeBackground = () => {
    const scroll = Math.abs(scrollRef?.current.scrollTop);
    if (scrollPos && scroll > scrollPos) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    if (scrollRef)
      scrollRef.current.addEventListener("scroll", changeBackground);
    return () => {
      if (scrollRef && scrollRef.current) {
        scrollRef.current.removeEventListener("scroll", changeBackground);
      }
    };
  }, [isScrolled]);

  return (
    <div
      className={clsx(`flex mb-5 justify-left px-5 ${className}`, {
        "shadow-lg": isScrolled,
      })}
    >
      {steps &&
        steps.map((item: any, index: number) => (
          <Steps
            key={index}
            index={index}
            label={item}
            selected={activeStep === index + 1}
            activeStep={activeStep}
            updateStep={updateStep}
            position={position}
          ></Steps>
        ))}
    </div>
  );
}
