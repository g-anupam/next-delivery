// src/app/api/users/orders/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded?.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const [customerRows]: any = await db.query(
      "SELECT Customer_ID FROM Customer WHERE userId = ?",
      [decoded.userId],
    );
    if (!Array.isArray(customerRows) || customerRows.length === 0) {
      return NextResponse.json({ orders: [] });
    }
    const customerId = customerRows[0].Customer_ID;

    const [rows]: any = await db.query(
      `SELECT o.Order_ID, o.Status, o.Restaurant_ID, o.Payment_ID, o.Address_ID, p.Amount, p.Payment_Method
       FROM Customer_Order o
       LEFT JOIN Payment p ON o.Payment_ID = p.Payment_ID
       WHERE o.Customer_ID = ?
       ORDER BY o.Order_ID DESC`,
      [customerId],
    );

    return NextResponse.json(rows);
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
