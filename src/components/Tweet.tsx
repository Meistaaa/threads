import Image from "next/image";
import { Heart, MessageSquare, Repeat2, Upload } from "lucide-react";

interface TweetProps {
  content: string;
  imageUrls?: string[];
}

export function Tweet({ content, imageUrls }: TweetProps) {
  return (
    <div className="flex space-x-4 p-4 border-b border-gray-800">
      <div className="flex-1 min-w-0">
        <p className="mt-2 break-words">{content}</p>
        {imageUrls &&
          imageUrls.map((imageUrl: string, index: number) => (
            <div key={index} className="rounded-xl overflow-hidden">
              <Image
                src={imageUrl}
                alt={`Tweet image ${index + 1}`}
                width={400}
                height={300}
                layout="responsive"
              />
            </div>
          ))}
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
