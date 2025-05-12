import React from "react";
import clsx from "clsx";

export default function Label({
  isRequired = false,
  title,
  isMargin = false,
  isLowerCase = false,
  className,
}: {
  isRequired?: boolean;
  title: string;
  isMargin?: boolean;
  isLowerCase?: boolean;
  className?: string;
}) {
  const caseClass = isLowerCase ? "capitalize" : "uppercase";
  return (
    <label
      className={clsx(
        `${caseClass} ${className} text-dark/90 font-semibold text-xs`,
        {
          "mb-2": isMargin,
        }
      )}
    >
      {title}
      {isRequired && <span className="text-primary">*</span>}
    </label>
  );
}
