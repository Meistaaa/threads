import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  Search,
  Bell,
  Mail,
  List,
  Bookmark,
  User,
  MoreHorizontal,
} from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Explore", href: "/" },
  { icon: Bell, label: "Notifications", href: "/" },
  { icon: Mail, label: "Messages", href: "/" },
  { icon: List, label: "Lists", href: "/" },
  { icon: Bookmark, label: "Bookmarks", href: "/" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: MoreHorizontal, label: "More", href: "/" },
];

export function LeftSidebar() {
  return (
    <aside className="w-20 xl:w-72 p-4  flex-col h-screen sticky top-0 hidden sm:flex">
      <div className="mb-4">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-white"
          fill="currentColor"
        >
          <g>
            <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
          </g>
        </svg>
      </div>
      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavItem
            href={item.href}
            key={item.label}
            icon={<item.icon className="h-6 w-6" />}
            label={item.label}
          />
        ))}
      </nav>

      <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 xl:hidden rounded-full p-3">
        <svg
          viewBox="0 0 24 24"
          className="h-6 w-6 text-white"
          fill="currentColor"
        >
          <g>
            <path d="M8.8 7.2H5.6V3.9c0-.4-.3-.8-.8-.8s-.7.4-.7.8v3.3H.8c-.4 0-.8.3-.8.8s.3.8.8.8h3.3v3.3c0 .4.3.8.8.8s.8-.3.8-.8V8.7H9c.4 0 .8-.3.8-.8s-.5-.7-1-.7zm15-4.9v-.1h-.1c-.1 0-9.2 1.2-14.4 11.7-3.8 7.6-3.6 9.9-3.3 9.9.3.1 3.4-6.5 6.7-9.2 5.2-1.1 6.6-3.6 6.6-3.6s-1.5.2-2.1.2c-.8 0-1.4-.2-1.7-.3 1.3-1.2 2.4-1.5 3.5-1.7.9-.2 1.8-.4 3-1.2 2.2-1.6 1.9-5.5 1.8-5.7z"></path>
          </g>
        </svg>
      </Button>
    </aside>
  );
}

function NavItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-4 text-xl hover:bg-gray-900 rounded-full p-3"
    >
      {icon}
      <span className="hidden xl:inline">{label}</span>
    </Link>
  );
}
