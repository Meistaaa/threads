import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Heart,
  MessageSquare,
  Repeat2,
  Share,
} from "lucide-react";
import { useState } from "react";
import { User } from "@/app/models/User";

interface ThreadPost {
  content: string;
  imageUrls?: string[];
  commentCount?: number;
  repostCount?: number;
  likeCount?: number;
  author: User;
  createdAt: string;
}

export function Thread({
  content,
  imageUrls = [],
  commentCount = 0,
  repostCount = 0,
  likeCount = 0,
  author,
  createdAt,
}: ThreadPost) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffHours < 24) {
      return `${diffHours}h`;
    } else if (diffDays < 7) {
      return `${diffDays}d`;
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return ({author.avatar && (
    <div className="flex p-4 space-x-6 border-b border-gray-800">
      <div className="flex-shrink-0">
        
          <Image
            src={author.avatar}
            alt={`${author.username}'s avatar`}
            width={64} // Adjusted for more space
            height={64} // Maintain aspect ratio
            className="rounded-full object-cover" // Ensure the image fits well
          />
       
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2 mb-1">
          <span className="font-bold text-white">{author.username}</span>
          <span className="text-gray-500 text-sm">·</span>
          <span className="text-gray-500 text-sm">{formatDate(createdAt)}</span>
        </div>
        <p className="break-words text-base text-gray-200">{content}</p>
        {imageUrls.length > 0 && (
          <div className="relative w-full h-64 mt-3 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
            <Image
              src={imageUrls[currentImageIndex]}
              alt={`Uploaded image ${currentImageIndex + 1}`}
              className="w-full h-full object-cover"
              width={1000}
              height={1000}
            />
            {imageUrls.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? imageUrls.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={() =>
                    setCurrentImageIndex((prev) =>
                      prev === imageUrls.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Next image"
                >
                  <ChevronRightIcon className="w-6 h-6" />
                </button>
              </>
            )}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {imageUrls.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-4 text-gray-500 max-w-md">
          <button className="flex items-center space-x-2 hover:text-blue-400">
            <MessageSquare className="h-5 w-5" />
            <span className="text-sm">{commentCount}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-400">
            <Repeat2 className="h-5 w-5" />
            <span className="text-sm">{repostCount}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-red-400">
            <Heart className="h-5 w-5" />
            <span className="text-sm">{likeCount}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-400">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )}
  );
}
