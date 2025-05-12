import React from "react";
import Lottie from "lottie-react";
import emptyAnim from "@/assets/lottie/empty.json";

type Props = {
  className?: string;
};
function ComingSoon({ className = "mb-3 h-60" }: Props) {
  return (
    <div className="h-full flex items-center justify-center">
      <div>
        <Lottie animationData={emptyAnim} className={className} loop={false} />
        <p className="text-primary text-xl font-bold text-center">
          Coming Soon
        </p>
        <p className="text-medium text-center">
          This feature is on it&apos;s way
        </p>
      </div>
    </div>
  );
}

export default ComingSoon;
