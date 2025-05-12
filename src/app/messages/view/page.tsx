"use client";

import React, { Suspense } from "react";
import { NextPage } from "next";
import Messages from "@/components/Messages/Messages";

const ReadMessage: NextPage = () => {
  return (
    <Suspense>
      <Messages />
    </Suspense>
  );
};

export default ReadMessage;
