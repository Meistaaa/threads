import Link from "next/link";
import { Home, Search, Bell, Mail } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home" },
  { icon: Search, label: "Explore" },
  { icon: Bell, label: "Notifications" },
  { icon: Mail, label: "Messages" },
];

export function BottomNav() {
  return (
    <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link key={item.label} href="#" className="p-4">
            <item.icon className="h-6 w-6" />
          </Link>
        ))}
      </div>
    </nav>
  );
}
