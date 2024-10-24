"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfile from "../edit-user-profile/edit-user-profile";
import Image from "next/image";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";

export default function FullUserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("meista");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const handleProfileUpdate = (data) => {
    setUsername(data.username);
    setBio(data.bio);
    setProfilePic(data.profilePic);
    setIsOpen(false);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4">
      <Card className="bg-zinc-900 text-white">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">{username}</h1>
              <p className="text-zinc-400">retarded_meista</p>
            </div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-yellow-500 overflow-hidden">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profilePic} alt="Profile" />
                <AvatarFallback className="text-black">
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="text-black w-full mb-4">
                Edit profile
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-800 text-white">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <EditProfile
                username={username}
                bio={bio}
                profilePic={profilePic}
                onSave={handleProfileUpdate}
              />
            </DialogContent>
          </Dialog>

          <Tabs defaultValue="threads" className="w-full">
            <TabsList className="w-full bg-zinc-900 p-0">
              <TabsTrigger
                value="threads"
                className="flex-1 bg-transparent text-white data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none"
              >
                Threads
              </TabsTrigger>
              <TabsTrigger
                value="replies"
                className="flex-1 bg-transparent text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none"
              >
                Replies
              </TabsTrigger>
              <TabsTrigger
                value="reposts"
                className="flex-1 bg-transparent text-zinc-500 data-[state=active]:bg-zinc-900 data-[state=active]:text-white data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-white rounded-none"
              >
                Reposts
              </TabsTrigger>
            </TabsList>
            <TabsContent value="threads">
              <div className="flex items-center gap-2 mt-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-yellow-500"></div>
                <Input
                  placeholder="What's new?"
                  className="bg-zinc-800 border-none"
                />
                <Button>Post</Button>
              </div>
            </TabsContent>
            <TabsContent value="replies">
              <p className="text-zinc-400 mt-4">
                Your replies will appear here.
              </p>
            </TabsContent>
            <TabsContent value="reposts">
              <p className="text-zinc-400 mt-4">
                Your reposts will appear here.
              </p>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Finish your profile</h2>
            <div className="space-y-4">
              {["Create thread", "Add bio", "Add profile photo"].map(
                (item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                        {index === 0 && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v12m6-6H6"
                            />
                          </svg>
                        )}
                      </div>
                      <p className="text-lg">{item}</p>
                    </div>
                    <Button variant="outline">Add</Button>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
