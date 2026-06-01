import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isLoginPage = pathname === "/login";
  const isProtectedRoute =
    pathname.startsWith("/client") || pathname.startsWith("/operator");

  // Guard protected routes — must have a valid token
  if (isProtectedRoute) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const verified = await verifyToken(token);
    if (!verified) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const role = verified.role as string;
    if (pathname.startsWith("/client") && role !== "CLIENT") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (pathname.startsWith("/operator") && role !== "OPERATOR") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/client/:path*",
    "/operator/:path*",
    "/login",
  ],
};