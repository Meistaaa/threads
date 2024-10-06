// middleware.js
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/sign-in", "/sign-up", "/", "/verify/:path*"], // Adjust this as necessary
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;
  // Check if user is already on the homepage and authenticated
  if (token && url.pathname === "/") {
    return NextResponse.next(); // Allow access to the homepage
  }

  // Redirect to homepage if the user is authenticated
  if (
    token &&
    (url.pathname.startsWith("/sign-in") || url.pathname.startsWith("/sign-up"))
  ) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect to homepage
  }

  // If not authenticated and trying to access protected routes
  if (!token && url.pathname !== "/sign-in" && url.pathname !== "/sign-up") {
    return NextResponse.redirect(new URL("/sign-in", request.url)); // Redirect to sign-in
  }

  return NextResponse.next();
}
