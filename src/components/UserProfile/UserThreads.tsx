"use client";
import { ThreadModel } from "@/app/models/Thread";
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Thread } from "../Thread";

const UserThreads = () => {
  const [threads, setThreads] = useState<ThreadModel[]>([]);
  const [cursor, setCursor] = useState<Date | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastThreadRef = useCallback(
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
      .get("/api/get-user-threads", {
        params: { cursor: cursor?.toISOString(), limit: 2 },
      })
      .then((res) => {
        const newthreads = res.data.data;

        // Update threads state without duplicates
        setThreads((prevthreads) => [
          ...prevthreads,
          ...newthreads.filter(
            (thread: ThreadModel) =>
              !prevthreads.some((p) => p._id === thread._id)
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
        <h1 className="text-xl font-bold">Your Threads</h1>
      </header>
      <div className="flex-1">
        {threads.length > 0 ? (
          threads.map((thread, index) => {
            if (threads.length === index + 1) {
              return (
                <div ref={lastThreadRef} key={thread._id}>
                  <Thread
                    author={thread.author}
                    content={thread.text}
                    imageUrls={thread.imageUrls}
                    createdAt={thread.createdAt.toString()}
                  />
                </div>
              );
            } else {
              return (
                <div key={thread._id}>
                  <Thread
                    createdAt={thread.createdAt.toString()}
                    author={thread.author}
                    content={thread.text}
                    imageUrls={thread.imageUrls}
                  />
                </div>
              );
            }
          })
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No threads to show
          </div>
        )}
      </div>
    </div>
  );
};

export default UserThreads;
