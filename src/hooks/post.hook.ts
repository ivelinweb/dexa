"use client";

import { useEffect, useState } from "react";
import { Post } from "@/interfaces/feed.interface";

function usePost(props: Post) {
  const [post, setPost] = useState<Post>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!props || post) return;
    fetchData();
  }, [props, post]);

  const fetchData = async () => {
    try {
      const response = await fetch(props.content);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPost(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  return { post, isLoading };
}

export default usePost;
