import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Heart, Upload, Repeat2 } from "lucide-react";
import Image from "next/image";

export function MainContent() {
  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Home</h1>
      </header>
      <div className="flex-1">
        <TweetBox />
        <Tweet
          avatar="/placeholder.svg?height=40&width=40"
          name="User Name"
          handle="@username"
          content="This is a sample tweet content. It can be much longer and may include mentions, hashtags, and links."
          image="/placeholder.svg?height=300&width=400"
        />
        <Tweet
          avatar="/placeholder.svg?height=40&width=40"
          name="Another User"
          handle="@anotheruser"
          content="Here's another tweet without an image."
        />
      </div>
    </div>
  );
}

function TweetBox() {
  return (
    <div className="flex space-x-4 p-4 border-b border-gray-800">
      <Avatar>
        <AvatarImage src="/placeholder.svg?height=40&width=40" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Input
          className="w-full bg-transparent text-xl placeholder-gray-500 border-none focus:ring-0"
          placeholder="What is happening?!"
        />
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-2 text-blue-400">
            <button>
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Media"
                width={20}
                height={20}
              />
            </button>
            <button>
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="GIF"
                width={20}
                height={20}
              />
            </button>
            <button>
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Poll"
                width={20}
                height={20}
              />
            </button>
            <button>
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Emoji"
                width={20}
                height={20}
              />
            </button>
            <button>
              <Image
                src="/placeholder.svg?height=20&width=20"
                alt="Schedule"
                width={20}
                height={20}
              />
            </button>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-600">Post</Button>
        </div>
      </div>
    </div>
  );
}

function Tweet({
  avatar,
  name,
  handle,
  content,
  image,
}: {
  avatar: string;
  name: string;
  handle: string;
  content: string;
  image?: string;
}) {
  return (
    <div className="flex space-x-4 p-4 border-b border-gray-800">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-bold truncate">{name}</span>
          <span className="text-gray-500 truncate">{handle}</span>
        </div>
        <p className="mt-2 break-words">{content}</p>
        {image && (
          <div className="mt-2 rounded-xl overflow-hidden">
            <Image
              src={image}
              alt="Tweet image"
              width={400}
              height={300}
              layout="responsive"
            />
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
