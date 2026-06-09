import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

console.log("MIDDLEWARE RUNNING");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname === "/login";
  const isAdminRoute = pathname.startsWith("/admin");
  const isOperatorRoute = pathname.startsWith("/operator");
  const isClientRoute = pathname.startsWith("/client");
  const isViewerRoute = pathname.startsWith("/viewer");
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isRootRoute = pathname === "/";

  const isProtectedRoute =
    isAdminRoute ||
    isOperatorRoute ||
    isClientRoute ||
    isViewerRoute ||
    isDashboardRoute ||
    isRootRoute;

  if (isProtectedRoute) {
    if (!token) {
      if (isAuthPage) {
        return NextResponse.next();
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    const verified = await verifyToken(token);

    if (!verified) {
      // Clear invalid token cookie and redirect to login
      const response = NextResponse.redirect(new URL("/login", req.url));
      response.cookies.delete("token");
      return response;
    }

    const role = verified.role as string;

    const getRoleHomepage = (r: string) => {
      if (
        r === "MASTER_ADMIN" ||
        r === "CLIENT_ADMIN" ||
        r === "OPERATIONS_HEAD" ||
        r === "OPERATIONS_MANAGER"
      ) 
      {
        return "/admin";
      }
      if (r === "OPERATOR") 
      {
        return "/operator/dashboard";
      }
      return "/client/dashboard";
    };

    const homepage = getRoleHomepage(role);

    // Redirect root page or generic /dashboard route to the role-specific homepage
    if (isRootRoute || isDashboardRoute) {
      return NextResponse.redirect(new URL(homepage, req.url));
    }

    // Role access authorization check
    if (
      isAdminRoute &&
      ![
        "MASTER_ADMIN",
        "CLIENT_ADMIN",
        "OPERATIONS_HEAD",
        "OPERATIONS_MANAGER"
      ].includes(role)
    ) {
  return NextResponse.redirect(new URL(homepage, req.url));
}

    if (isOperatorRoute && role !== "OPERATOR") {
      return NextResponse.redirect(new URL(homepage, req.url));
    }

    if (
      isClientRoute &&
      ![
        "CLIENT_MANAGER",
        "SITE_ADMIN",
        "TECHNICIAN",
        "DOCTOR"
      ].includes(role)
    ) {
  return NextResponse.redirect(new URL(homepage, req.url));
}
  }

  // Prevent logged-in users from visiting login page
  if (isAuthPage && token) {
    const verified = await verifyToken(token);
    if (verified) {
      const role = verified.role as string;
      const homepage =
       role === "MASTER_ADMIN" ||
       role === "CLIENT_ADMIN" ||
       role === "OPERATIONS_HEAD" ||
       role === "OPERATIONS_MANAGER"
        ? "/admin"
        : role === "OPERATOR"
        ? "/operator/dashboard"
        : "/client/dashboard";
      return NextResponse.redirect(new URL(homepage, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/admin/:path*",
    "/operator/:path*",
    "/client/:path*",
    "/viewer/:path*",
    "/dashboard/:path*",
  ],
};