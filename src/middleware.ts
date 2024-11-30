import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/verify/:path*", // Adjust this as necessary
    "/onboarding/:path*", // Match all onboarding paths dynamically
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  console.log("Token:", token);
  console.log("Current Path:", url.pathname);

  // If user is authenticated and onboarded, allow access to all pages
  if (token && token.isVerified && token.onBoarded) {
    // Prevent redirect loop: Allow `/onboarding/:username` to pass
    if (url.pathname.startsWith(`/onboarding/`)) {
      return NextResponse.redirect(new URL("/", request.url)); // Redirect to home
    }
    return NextResponse.next();
  }

  // If user is authenticated but not onboarded, redirect to onboarding
  if (token && token.isVerified && !token.onBoarded) {
    // Prevent redirect loop: Allow `/onboarding/:username` to pass
    if (!url.pathname.startsWith(`/onboarding/`)) {
      return NextResponse.redirect(
        new URL(`/onboarding/${token.username}`, request.url)
      );
    }
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to `/sign-in` for protected routes
  if (!token) {
    const isProtectedRoute =
      url.pathname !== "/sign-in" && url.pathname !== "/sign-up";
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  // Allow access to public and allowed routes
  return NextResponse.next();
}
