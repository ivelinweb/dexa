import React from "react";

function LoaderStream() {
  return (
    <div className="bg-dark px-10 md:px-20 h-full w-full flex items-center justify-center">
      <div className="text-white text-center">
        <div className="border-dark mx-auto h-14 w-14 animate-spin rounded-full border-4 border-t-medium" />
      </div>
    </div>
  );
}

export default LoaderStream;
