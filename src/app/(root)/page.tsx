import { BottomNav } from "@/components/bottom-navbar/BottomNavbar";
import { LeftSidebar } from "@/components/left-sidebar/LeftSidebar";
import { MainContent } from "@/components/main-content/main-content";
import { RightSidebar } from "@/components/right-sidebar/RightSidebar";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      <div className="flex flex-1 justify-center">
        <div className="flex w-full max-w-7xl">
          <LeftSidebar />
          <main className="flex-1 border-x border-gray-800 min-h-screen">
            <MainContent />
          </main>
          <RightSidebar />
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
