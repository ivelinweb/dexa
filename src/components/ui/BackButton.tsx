"use client";

import React from "react";
import Button from "../Form/Button";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

function BackButton() {
  const router = useRouter();
  return (
    <Button
      type={"button"}
      kind={"default"}
      shape={"CIRCLE"}
      className="text-dark hover:bg-light"
      hoverColor={false}
      title="Back"
      onClick={() => router.back()}
    >
      <ArrowLeft height={23} />
    </Button>
  );
}

export default BackButton;
