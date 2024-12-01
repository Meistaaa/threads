import ThreadPost from "@/components/ThreadPost/ThreadPost";
import { MainContent } from "@/components/MainContent/MainContent";
import axios from "axios";
import { User } from "../models/User";

export default async function Home() {
  try {
    console.log("hello from main ");
    const res = await axios.get("http://localhost:3000/api/me");
    const user = res.data.data; // Assuming user data is in res.data.data
    return (
      <>
        <ThreadPost />
        <MainContent />
      </>
    );
  } catch (error) {
    console.error("Error fetching user data:", error);
    // Handle the error appropriately, e.g., display an error message to the user
  }
}
