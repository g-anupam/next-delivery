import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [rows] = await db.query("SELECT * FROM Restaurant");
    console.log("Fetched restaurants:", rows); // <--- add this
    return NextResponse.json(rows);
  } catch (err) {
    console.error("Error fetching restaurants:", err);
    return NextResponse.json(
      { error: "Failed to fetch restaurants" },
      { status: 500 },
    );
  }
}
