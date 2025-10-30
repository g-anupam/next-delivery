import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received signup data:", body);

  return NextResponse.json(
    { message: `Signup received for ${body.role}` },
    { status: 200 },
  );
}
