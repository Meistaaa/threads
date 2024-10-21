import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Search } from "lucide-react";

export function RightSidebar() {
  return (
    <aside className="w-0 invisible xl:w-[350px] xl:visible p-4 space-y-4 sticky top-0 h-screen overflow-y-auto">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <Input
          className="pl-10 bg-gray-900 border-gray-800 focus:border-blue-500"
          placeholder="Search"
        />
      </div>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-white font-bold">
            Subscribe to Premium
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-400 mb-4">
            Subscribe to unlock new features and if eligible, receive a share of
            ads revenue.
          </p>
          <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold">
            Subscribe
          </Button>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Who to follow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <FollowSuggestion
            avatar="/placeholder.svg?height=40&width=40"
            name="mat ☆"
            handle="@adasfile"
          />
          <FollowSuggestion
            avatar="/placeholder.svg?height=40&width=40"
            name="Google  Translated JoJo P"
            handle="@JojoGTranslated"
          />
          <FollowSuggestion
            avatar="/placeholder.svg?height=40&width=40"
            name="Chloesimagination 🐰"
            handle="@ChloeImagine"
          />
          <Link href="#" className="text-blue-400 text-sm hover:underline">
            Show more
          </Link>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            France trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <TrendingTopic
            category="Super Mario · Trending"
            hashtag="#LEGOSuperMarioWorld"
            posts="4,823 posts"
          />
          <TrendingTopic
            category="Trending"
            hashtag="#FreebetWinamax"
            posts="23.2K posts"
          />
          <TrendingTopic
            category="Trending"
            hashtag="Moldavie"
            posts="24.3K posts"
          />
          <TrendingTopic
            category="TV stars · Trending"
            hashtag="Ardisson"
            posts="19.9K posts"
          />
          <Link href="#" className="text-blue-400 text-sm hover:underline">
            Show more
          </Link>
        </CardContent>
      </Card>
    </aside>
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
      <div className="flex items-center space-x-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={avatar} alt={name} />
          <AvatarFallback>{name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-bold text-sm text-white">{name}</p>
          <p className="text-sm text-gray-500">{handle}</p>
        </div>
      </div>
      <Button variant="outline" className="rounded-full text-sm font-bold">
        Follow
      </Button>
    </div>
  );
}

function TrendingTopic({
  category,
  hashtag,
  posts,
}: {
  category: string;
  hashtag: string;
  posts: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs text-gray-500">{category}</p>
      <p className="font-bold text-white">{hashtag}</p>
      <p className="text-xs text-white">{posts}</p>
    </div>
  );
}
