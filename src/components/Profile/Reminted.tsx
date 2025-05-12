"use client";

import React, { useEffect, useState } from "react";
import ListPost from "../Posts/ListPost/ListPost";
import { Post } from "@/interfaces/feed.interface";
import EmptyBox from "../ui/EmptyBox";

type Props = {
  posts: Post[];
  username: string;
};

function Reminted({ posts, username }: Props) {
  const [reminted, setReminted] = useState<Post[]>([]);
  useEffect(() => {
    if (posts) {
      const filtered = posts.filter((f) => f.isReminted);
      setReminted(filtered);
    }
  }, [posts]);
  return (
    <div>
      {reminted.length > 0 ? (
        <>
          {reminted.map((post: Post, index: number) => (
            <div key={index} className="border-b border-light last:border-none">
              <ListPost post={post} />
            </div>
          ))}
        </>
      ) : (
        <div>
          <div className="text-center py-20">
            <EmptyBox
              title="Empty remints"
              message={`${username} haven't reminted any mintable`}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Reminted;
