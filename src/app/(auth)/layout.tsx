import { Inter } from "next/font/google";
import "../globals.css";
import AuthProvider from "../context/AuthProvider";
export const metadata = {
  title: "Threads",
  description: "Threads Clone",
};
const inter = Inter({ subsets: ["latin"] });
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className}>{children}</body>
      </AuthProvider>
    </html>
  );
}
