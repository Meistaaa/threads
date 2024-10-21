import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Bookmark,
  Home,
  List,
  Mail,
  Search,
  User,
  MoreHorizontal,
  MessageSquare,
  Heart,
  Upload,
  Repeat2,
} from "lucide-react";

export default function TwitterLayout() {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Left Sidebar */}
      <aside className="w-64 p-4 flex flex-col">
        <div className="mb-4">
          <svg
            viewBox="0 0 24 24"
            className="h-8 w-8 text-white"
            fill="currentColor"
          >
            <g>
              <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
            </g>
          </svg>
        </div>
        <nav className="space-y-4">
          <NavItem icon={<Home className="h-6 w-6" />} label="Home" />
          <NavItem icon={<Search className="h-6 w-6" />} label="Explore" />
          <NavItem icon={<Bell className="h-6 w-6" />} label="Notifications" />
          <NavItem icon={<Mail className="h-6 w-6" />} label="Messages" />
          <NavItem icon={<List className="h-6 w-6" />} label="Lists" />
          <NavItem icon={<Bookmark className="h-6 w-6" />} label="Bookmarks" />
          <NavItem icon={<User className="h-6 w-6" />} label="Profile" />
          <NavItem icon={<MoreHorizontal className="h-6 w-6" />} label="More" />
        </nav>
        <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600">
          Tweet
        </Button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 border-x border-gray-800">
        <header className="sticky top-0 z-10 bg-black bg-opacity-70 backdrop-blur p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">Home</h1>
        </header>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-4">
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
        </ScrollArea>
      </main>

      {/* Right Sidebar */}
      <aside className="w-80 p-4">
        <Input className="mb-4" placeholder="Search Twitter" />
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Subscribe to Premium</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-400 mb-2">
              Subscribe to unlock new features and if eligible, receive a share
              of ads revenue.
            </p>
            <Button className="w-full bg-blue-500 hover:bg-blue-600">
              Subscribe
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Who to follow</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FollowSuggestion
              avatar="/placeholder.svg?height=40&width=40"
              name="Suggested User"
              handle="@suggesteduser"
            />
            <FollowSuggestion
              avatar="/placeholder.svg?height=40&width=40"
              name="Another Suggestion"
              handle="@anothersuggestion"
            />
            <Link href="#" className="text-blue-400 text-sm">
              Show more
            </Link>
          </CardContent>
        </Card>
      </aside>
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Link
      href="#"
      className="flex items-center space-x-4 text-xl hover:bg-gray-900 rounded-full p-3"
    >
      {icon}
      <span>{label}</span>
    </Link>
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
        <textarea
          className="w-full bg-transparent text-xl placeholder-gray-500 outline-none resize-none"
          placeholder="What is happening?!"
          rows={3}
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
    <div className="flex space-x-4 border-b border-gray-800 pb-4">
      <Avatar>
        <AvatarImage src={avatar} />
        <AvatarFallback>UN</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-bold">{name}</span>
          <span className="text-gray-500">{handle}</span>
        </div>
        <p className="mt-2">{content}</p>
        {image && (
          <Image
            src={image}
            alt="Tweet image"
            width={400}
            height={300}
            className="mt-2 rounded-xl"
          />
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

function FollowSuggestion({
  avatar,
  name,
  handle,
}: {
  avatar: string;
  name: string;
  handle: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <Avatar>
          <AvatarImage src={avatar} />
          <AvatarFallback>SU</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-sm text-gray-500">{handle}</p>
        </div>
      </div>
      <Button variant="outline" className="rounded-full">
        Follow
      </Button>
    </div>
  );
}
