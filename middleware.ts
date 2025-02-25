// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const path = request.nextUrl.pathname;

  // Avoid redirect loops by checking the URL
  if (request.nextUrl.searchParams.get("redirected") === "true") {
    return NextResponse.next();
  }

  // Get user from cookie if exists
  let user = null;
  try {
    user = request.cookies.get("user")?.value
      ? JSON.parse(request.cookies.get("user")?.value || '{}')
      : null;
  } catch (error) {
    // Handle parsing error, invalid JSON in cookie
    console.error("Error parsing user cookie:", error);
  }

  // Public paths that don't require authentication
  if (path === "/login") {
    if (token && user) {
      const redirectUrl = new URL(
        user.role === "admin" ? "/admin/dashboard" : "/volunteer/dashboard",
        request.url
      );
      redirectUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(redirectUrl);
    }
    return NextResponse.next();
  }

  // Check for authenticated routes
  if (path.startsWith("/admin") || path.startsWith("/volunteer")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(loginUrl);
    }

    // Role-based access control
    if (path.startsWith("/admin") && user?.role !== "admin") {
      const redirectUrl = new URL("/volunteer/dashboard", request.url);
      redirectUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(redirectUrl);
    }

    if (path.startsWith("/volunteer") && user?.role !== "volunteer") {
      const redirectUrl = new URL("/admin/dashboard", request.url);
      redirectUrl.searchParams.set("redirected", "true");
      return NextResponse.redirect(redirectUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/volunteer/:path*", "/login"],
};
