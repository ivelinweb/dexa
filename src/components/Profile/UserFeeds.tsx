"use client";

import React from "react";
import ListPost from "../Posts/ListPost/ListPost";
import { Post } from "@/interfaces/feed.interface";
import EmptyBox from "../ui/EmptyBox";

type Props = {
  posts: Post[];
  msg: string;
};

function UserFeeds({ posts, msg }: Props) {
  return (
    <div>
      {posts.length > 0 ? (
        <>
          {posts
            .filter((f) => !f.isReminted)
            .map((post: Post, index: number) => (
              <div
                key={index}
                className="border-b border-light last:border-none"
              >
                <ListPost post={post} />
              </div>
            ))}
        </>
      ) : (
        <>
          <div>
            <div className="text-center py-20">
              <EmptyBox title="Empty remints" message={`${msg}`} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default UserFeeds;
