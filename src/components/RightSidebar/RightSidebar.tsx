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
          className="pl-10 bg-black border-gray-800 focus:border-blue-500"
          placeholder="Search"
        />
      </div>

      <Card className="bg-black border-gray-800">
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
