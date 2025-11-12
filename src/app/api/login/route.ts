import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    // ✅ Query users table
    const [rows] = await db.query("SELECT * FROM Users WHERE email = ?", [
      email,
    ]);
    const user = Array.isArray(rows) ? rows[0] : null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // ✅ Correct field names
    const payload = {
      userId: user.id, // ← fixed here
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

    // ✅ Create secure cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    const response = NextResponse.json({
      message: "Login successful",
      role: user.role,
    });
    response.headers.set("Set-Cookie", cookie);

    return response;
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
