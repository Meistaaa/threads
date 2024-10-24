import Image from "next/image";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Heart,
  MessageSquare,
  Repeat2,
  Upload,
} from "lucide-react";
import { useState } from "react";

interface TweetProps {
  content: string;
  imageUrls?: string[];
}

export function Tweet({ content, imageUrls }: TweetProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  return (
    <div className="flex space-x-4 p-4 border-b border-gray-800">
      <div className="flex-1 min-w-0">
        <p className="mt-2 break-words">{content}</p>
        {imageUrls && imageUrls.length > 0 && (
          <div className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
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
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex((prev) =>
                      prev === 0 ? imageUrls.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75 transition-opacity"
                  aria-label="Previous image"
                >
                  <ChevronLeftIcon className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setCurrentImageIndex((prev) =>
                      prev === imageUrls.length - 1 ? 0 : prev + 1
                    );
                  }}
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
        <div className="flex justify-between mt-4 text-gray-500">
          <button className="flex items-center space-x-2 hover:text-blue-400">
            <MessageSquare className="h-5 w-5" />
            <span>10</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-400">
            <Repeat2 className="h-5 w-5" />
            <span>5</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-red-400">
            <Heart className="h-5 w-5" />
            <span>20</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-blue-400">
            <Upload className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
