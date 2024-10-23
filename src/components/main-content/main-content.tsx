"use client";
import { Thread } from "@/app/types/Threads";
import ThreadPost from "../thread-post/thread-post";
import { Tweet } from "../Tweet";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

export function MainContent() {
  const [posts, setPosts] = useState<Thread[]>([]);
  const [cursor, setCursor] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMore = useCallback(() => {
    setLoading(true);

    axios
      .get("/api/get-threads", {
        params: { cursor: cursor?.toISOString(), limit: 10 },
      })
      .then((res) => {
        setPosts((prev) => [...prev, ...res.data.data]);
        setHasMore(res.data.data.length > 0);
        setCursor(res.data.nextCursor ? new Date(res.data.nextCursor) : null);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [cursor]);

  useEffect(() => {
    loadMore();
  }, []);
  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <div className="flex-1">
        <ThreadPost></ThreadPost>
        {posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <div ref={lastPostRef} key={post._id}>
                <Tweet content={post.text} imageUrls={post.imageUrls} />
              </div>
            );
          } else {
            return (
              <div key={post._id}>
                <Tweet content={post.text} imageUrls={post.imageUrls} />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
