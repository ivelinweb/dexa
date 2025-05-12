import React from "react";

export default function ProgressBar({
  className,
  progress,
}: React.HTMLAttributes<HTMLDivElement> & {
  className?: string;
  progress: number;
}) {
  const size = 45,
    trackWidth = 5,
    indicatorWidth = 5,
    indicatorCap = `round`;

  const center = size / 2,
    radius =
      center - (trackWidth > indicatorWidth ? trackWidth : indicatorWidth),
    dashArray = 2 * Math.PI * radius,
    dashOffset = dashArray * ((100 - progress) / 100);

  return (
    <div className="inline-flex items-center justify-center relative overflow-hidden rounded-full bottom-0 left-5">
      <svg style={{ width: size, height: size }}>
        <circle
          className="text-neutral-300"
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          stroke="currentColor"
          strokeWidth={trackWidth}
        />
        <circle
          className={`${className} text-primary`}
          cx={center}
          cy={center}
          fill="transparent"
          r={radius}
          stroke="currentColor"
          strokeWidth={indicatorWidth}
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
          strokeLinecap={indicatorCap}
        />
      </svg>
      <span className="absolute text-main text-[.5rem]">{progress}%</span>
    </div>
  );
}
