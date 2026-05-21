import { NextRequest, NextResponse } from "next/server";

console.log("MIDDLEWARE RUNNING");

import { verifyToken } from "@/lib/auth";

export async function middleware(
  req: NextRequest
) {
  const token =
    req.cookies.get("token")?.value;

  const isAuthPage =
    req.nextUrl.pathname === "/login";

  const isDashboardRoute =
    req.nextUrl.pathname.startsWith(
      "/dashboard"
    );

  if (isDashboardRoute) {
    if (!token) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }

    const verified =
      await verifyToken(token);

    if (!verified) {
      return NextResponse.redirect(
        new URL("/login", req.url)
      );
    }
  }

  if (isAuthPage && token) {
    const verified =
      await verifyToken(token);

    if (verified) {
      return NextResponse.redirect(
        new URL("/dashboard", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/login",
  ],
};