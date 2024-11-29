import ThreadPost from "@/components/ThreadPost/ThreadPost";
import { MainContent } from "@/components/MainContent/MainContent";

export default async function Home() {
  return (
    <>
      <ThreadPost />
      <MainContent />
    </>
  );
}
