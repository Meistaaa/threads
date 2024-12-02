import axios from "axios";
import ThreadPost from "@/components/ThreadPost/ThreadPost";
import { MainContent } from "@/components/MainContent/MainContent";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/(authentication)/auth/[...nextauth]/options";
import axiosInstance from "../lib/axios";

async function fetchUserAvatar() {
  try {
    // Retrieve the session for authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.accessToken) {
      throw new Error("User is not authenticated");
    }

    const response = await axiosInstance.get(`api/me`);

    // Extract avatar URL from response
    return response.data?.data?.avatar || null;
  } catch (error) {
    console.error("Error fetching user avatar:", error);
    return null; // Return null as fallback
  }
}

export default async function Home() {
  const avatar = await fetchUserAvatar();

  return (
    <>
      <ThreadPost avatar={avatar} />
      <MainContent></MainContent>
    </>
  );
}
