import { BottomNav } from "@/components/bottom-navbar/BottomNavbar";
import { LeftSidebar } from "@/components/left-sidebar/LeftSidebar";
import { MainContent } from "@/components/main-content/main-content";
import { RightSidebar } from "@/components/right-sidebar/RightSidebar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1 w-full max-w-[600px] mx-auto border-x border-gray-800">
          <MainContent />
        </main>
        <RightSidebar />
      </div>
      <BottomNav />
    </div>
  );
}
