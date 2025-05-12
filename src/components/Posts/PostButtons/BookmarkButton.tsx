import React, { useEffect, useState } from "react";
import Button from "@/components/Form/Button";
import { Post } from "@/interfaces/feed.interface";
import { BookmarkIcon } from "lucide-react";
import {
  addBookmark,
  getBookmarkByPostId,
  removeBookmark,
} from "@/actions/bookmark.action";
import { useQuery } from "@tanstack/react-query";
import { QueryKeys } from "@/libs/enum";
import { queryClient } from "@/components/HTML";

type Props = { post: Post };
function BookmarkButton({ post }: Props) {
  const [bookmarked, setBookmarked] = useState<boolean>(false);

  const { data } = useQuery({
    queryKey: [`${post.id}`, QueryKeys.BOOKMARK],
    queryFn: () => getBookmarkByPostId(post.id),
  });

  useEffect(() => {
    if (data?.data && data.status) {
      setBookmarked(true);
    }
  }, [data?.data]);

  const initBookmark = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (bookmarked) {
      await removeBookmark(post.id);
    } else {
      await addBookmark({ postId: post.id });
    }
    queryClient.invalidateQueries({
      queryKey: [QueryKeys.BOOKMARKS],
    });
    queryClient.invalidateQueries({
      queryKey: [`${post.id}`, QueryKeys.BOOKMARK],
    });
    setBookmarked(!bookmarked);
  };

  return (
    <Button
      type={"button"}
      kind={"default"}
      shape={"CIRCLE"}
      className="text-dark group-hover:text-primary group-hover:bg-primary/20"
      hoverColor={false}
      onClick={initBookmark}
      title="Bookmark"
    >
      <BookmarkIcon
        size={18}
        className={`${bookmarked ? "fill-primary stroke-primary" : ""}`}
      />
    </Button>
  );
}

export default BookmarkButton;
