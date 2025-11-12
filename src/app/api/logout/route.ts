import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const serialized = serialize("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
    sameSite: "lax",
  });

  const response = NextResponse.json({ message: "Logged out successfully" });
  response.headers.set("Set-Cookie", serialized);
  return response;
}
