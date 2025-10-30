import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";

export async function GET() {
  try {
    const connection = await connectToDatabase();
    const [rows] = await connection.execute("SELECT 1 + 1 AS result");
    return NextResponse.json({ success: true, data: rows });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
