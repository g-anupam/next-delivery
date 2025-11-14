// src/app/api/users/orders/[id]/route.ts
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET(
  _req: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const orderId = Number(id);
    if (!orderId)
      return NextResponse.json({ error: "Invalid order id" }, { status: 400 });

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded?.userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Verify order belongs to user
    const [custRows]: any = await db.query(
      "SELECT Customer_ID FROM Customer WHERE userId = ?",
      [decoded.userId],
    );
    if (!Array.isArray(custRows) || custRows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const customerId = custRows[0].Customer_ID;

    const [orderRows]: any = await db.query(
      "SELECT * FROM Customer_Order WHERE Order_ID = ? AND Customer_ID = ?",
      [orderId, customerId],
    );
    if (!Array.isArray(orderRows) || orderRows.length === 0)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    const order = orderRows[0];

    const [items]: any = await db.query(
      `SELECT m.Menu_ID, m.Item_Name, m.Price
       FROM Order_Contains oc
       JOIN Menu m ON oc.Menu_ID = m.Menu_ID
       WHERE oc.Order_ID = ?`,
      [orderId],
    );

    const [paymentRows]: any = await db.query(
      "SELECT * FROM Payment WHERE Payment_ID = ?",
      [order.Payment_ID],
    );
    const [addressRows]: any = await db.query(
      "SELECT * FROM Delivery_Address WHERE Address_ID = ?",
      [order.Address_ID],
    );

    return NextResponse.json({
      order,
      items,
      payment: paymentRows[0] || null,
      address: addressRows[0] || null,
    });
  } catch (err: unknown) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 },
    );
  }
}
