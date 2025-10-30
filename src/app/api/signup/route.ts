import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    // Try to get a connection from the pool
    const connection = await pool.getConnection();
    console.log("Database connection successful");

    // Release the connection back to the pool
    connection.release();

    return NextResponse.json(
      { message: "Database connection successful" },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("❌ Database connection failed:", error.message);
    return NextResponse.json(
      { message: "Database connection failed", error: error.message },
      { status: 500 },
    );
  }
}
