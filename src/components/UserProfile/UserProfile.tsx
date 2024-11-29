"use client";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Ensure axios is installed, or replace with fetch
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EditProfile from "../EditUserProfile/EditUserProfile";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import UserThreads from "../UserProfile/UserThreads";

export interface UserProfile {
  username: string;
  bio: string;
  profilePic: string;
}

export default function FullUserProfile() {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    axios
      .get("/api/me")
      .then((response) => {
        const { username, bio, avatar } = response.data.data;
        console.log(response.data);
        setUsername(username || "");
        setBio(bio || "");
        setProfilePic(avatar || "");
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
        // Handle errors appropriately
      });
  }, [username, bio, profilePic]);

  const handleProfileUpdate = (data: UserProfile) => {
    setUsername(data.username);
    setBio(data.bio);
    setProfilePic(data.profilePic);
    setIsOpen(false);
  };

  return (
    <div className="bg-black bg-opacity-70 backdrop-blur text-white min-h-screen p-4">
      <Card className="bg-black bg-opacity-70 backdrop-blur text-white border-none">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profilePic} alt="Profile" />
              {username && (
                <AvatarFallback>
                  {username.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>Followers</div>
            <div>Following</div>
          </div>
          <div className="pt-2 ml-1">
            <div>
              <h1 className="text-2xl font-bold">{username}</h1>
            </div>
            <div>
              <h1 className=" ">{bio}</h1>
            </div>
          </div>
        </CardContent>
      </Card>

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
          <div>
            <UserThreads></UserThreads>
          </div>
        </TabsContent>
        <TabsContent value="replies">
          <p className="text-zinc-400 mt-4">Your replies will appear here.</p>
        </TabsContent>
        <TabsContent value="reposts">
          <p className="text-zinc-400 mt-4">Your reposts will appear here.</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
