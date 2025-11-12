import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("token", "", {
    httpOnly: true,
    path: "/",
    expires: new Date(0),
  });

  const response = NextResponse.json({ message: "Logged out" });
  response.headers.set("Set-Cookie", cookie);
  return response;
}
