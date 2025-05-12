import React from "react";
import Image from "next/image";
import { favicon } from "@/components/Icons/Connector";

function Loader() {
  return (
    <div className="h-svh flex items-center justify-center">
      <div className="flex justify-center">
        <Image
          src={favicon.main}
          width={260}
          height={260}
          alt={`dexa`}
          className="h-16 w-16 animate-pulse"
        />
      </div>
    </div>
  );
}

export default Loader;
