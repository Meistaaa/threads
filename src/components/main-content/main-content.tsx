"use client";
import { Thread } from "@/app/types/Threads";
import { Tweet } from "../Tweet";
import { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";

export function MainContent() {
  const [threads, setthreads] = useState<Thread[]>([]);
  const [cursor, setCursor] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastthreadRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return; // Prevent loading if it's already fetching or no more threads

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return; // Prevent loading if it's already fetching or no more threads

    setLoading(true); // Set loading to true
    axios
      .get("/api/get-threads", {
        params: { cursor: cursor?.toISOString(), limit: 2 },
      })
      .then((res) => {
        const newthreads = res.data.data;

        // Update threads state without duplicates
        setthreads((prevthreads) => [
          ...prevthreads,
          ...newthreads.filter(
            (thread: Thread) => !prevthreads.some((p) => p._id === thread._id)
          ),
        ]);
        setHasMore(newthreads.length > 0);
        setCursor(res.data.nextCursor ? new Date(res.data.nextCursor) : null);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false); // Reset loading state in finally to ensure it's set to false even on error
      });
  }, [cursor, loading, hasMore]);

  useEffect(() => {
    if (!loading && threads.length === 0) {
      loadMore(); // Fetch data only if there are no threads
    }
  }, [loading, threads.length, loadMore]); // Added dependencies for loadMore

  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <div className="flex-1">
        {threads.map((thread, index) => {
          if (threads.length === index + 1) {
            return (
              <div ref={lastthreadRef} key={thread._id}>
                <Tweet content={thread.text} imageUrls={thread.imageUrls} />
              </div>
            );
          } else {
            return (
              <div key={thread._id}>
                <Tweet content={thread.text} imageUrls={thread.imageUrls} />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
