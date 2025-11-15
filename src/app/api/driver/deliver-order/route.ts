import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId)
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "driver")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await db.query(
      `
      UPDATE Customer_Order
      SET Status = 'Delivered'
      WHERE Order_ID = ?
      `,
      [orderId],
    );

    return NextResponse.json({ message: "Order delivered" });
  } catch (err) {
    console.error("Deliver order error:", err);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 },
    );
  }
}
