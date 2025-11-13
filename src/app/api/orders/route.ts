import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    const body = await req.json();
    const { items } = body;

    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "No items in order" }, { status: 400 });

    // Assume all items belong to one restaurant
    const restaurantId = items[0].restaurantId;

    // Insert new order
    const [orderResult]: any = await db.query(
      "INSERT INTO Orders (Customer_ID, Restaurant_ID, Status, Total_Amount) VALUES (?, ?, ?, ?)",
      [
        decoded.userId,
        restaurantId,
        "Pending",
        items.reduce((acc, item) => acc + item.price * item.quantity, 0),
      ],
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await db.query(
        "INSERT INTO Order_Contains (Order_ID, Menu_ID, Quantity) VALUES (?, ?, ?)",
        [orderId, item.id, item.quantity],
      );
    }

    return NextResponse.json({ message: "Order placed", orderId });
  } catch (err) {
    console.error("Order placement error:", err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 },
    );
  }
}
