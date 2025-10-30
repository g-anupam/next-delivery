import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectToDatabase();
    const [rows] = await db.query("SELECT NOW() AS time");
    return NextResponse.json({
      message: "DB Connected!",
      time: (rows as any)[0].time,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Failed to connect to DB" },
      { status: 500 },
    );
  }
}
