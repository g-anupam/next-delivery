export const runtime = "nodejs";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  // Public routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname === "/" ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  // No token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId?: number;
      role?: string;
      email?: string;
    };

    // ✅ Role-based route protection
    if (pathname.startsWith("/users") && decoded.role !== "customer") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    if (pathname.startsWith("/restaurants") && decoded.role !== "restaurant") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Add decoded info to headers for API access
    const response = NextResponse.next();
    response.headers.set("x-user-id", String(decoded.userId || ""));
    response.headers.set("x-user-role", decoded.role || "");
    response.headers.set("x-user-email", decoded.email || "");
    return response;
  } catch (err) {
    console.error("JWT verification failed:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|public).*)"],
};
