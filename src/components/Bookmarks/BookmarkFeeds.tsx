"use client";

import { getAllBookmarks } from "@/actions/bookmark.action";
import { IBookmark } from "@/interfaces/bookmark.interface";
import { QueryKeys } from "@/libs/enum";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import Bookmark from "./Bookmark";
import EmptyBox from "../ui/EmptyBox";
import { LoaderCircleIcon } from "lucide-react";

function BookmarkFeeds() {
  const [bookmarks, setBookmarks] = useState<IBookmark[]>([]);
  const { data, isLoading } = useQuery({
    queryKey: [QueryKeys.BOOKMARKS],
    queryFn: getAllBookmarks,
  });

  useEffect(() => {
    if (data?.data && data.status) {
      setBookmarks(data.data);
    }
  }, [data?.data, data?.status]);

  return (
    <div>
      {isLoading && (
        <div className="flex py-3 justify-center w-full">
          <LoaderCircleIcon
            size={30}
            className="animate-spin duration-500 text-primary"
          />
        </div>
      )}

      {bookmarks.length > 0 && (
        <>
          {bookmarks.map((b, i) => (
            <Bookmark key={i} bookmark={b} />
          ))}
        </>
      )}
      {bookmarks.length < 1 && !isLoading && (
        <EmptyBox title="No Bookmarks" message="Try to bookmark a post" />
      )}
    </div>
  );
}

export default BookmarkFeeds;
