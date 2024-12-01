import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/sign-in",
    "/sign-up",
    "/",
    "/verify/:path*",
    "/onboarding/:path*",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const url = request.nextUrl;

  if (token && token.isVerified && token.onBoarded) {
    if (url.pathname.startsWith(`/onboarding/`)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (token && token.isVerified && !token.onBoarded) {
    if (!url.pathname.startsWith(`/onboarding/`)) {
      return NextResponse.redirect(
        new URL(`/onboarding/${token.username}`, request.url)
      );
    }
    return NextResponse.next();
  }

  if (!token) {
    const isProtectedRoute =
      url.pathname !== "/sign-in" && url.pathname !== "/sign-up";
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }
  }

  return NextResponse.next();
}
