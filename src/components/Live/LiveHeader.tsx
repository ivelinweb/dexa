import React from "react";
import { useAuth } from "@/context/auth.context";
import CreatorPFP from "../Posts/ListPost/CreatorPFP";
import Header from "../ui/Header";

type Props = {
  title: string;
  className?: string;
  isBack?: boolean;
};

function LiveHeader({ title, className, isBack }: Props) {
  const { user } = useAuth();
  return (
    <div className={`border-b border-light flex items-center justify-between ${className}`}>
      <Header title={title} isBack={isBack} />
      <div className="pr-5">
        <CreatorPFP
          username={user?.username}
          name={user?.name}
          pfp={user?.pfp}
        />
      </div>
    </div>
  );
}

export default LiveHeader;
