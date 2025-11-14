import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

type ItemPayload = { id: number; quantity: number };

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    if (!decoded?.userId)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const items: ItemPayload[] = body.items;
    const addressId: number = body.addressId;
    const paymentMethod: string = body.paymentMethod;

    if (!Array.isArray(items) || items.length === 0)
      return NextResponse.json({ error: "No items provided" }, { status: 400 });

    if (!addressId || !paymentMethod)
      return NextResponse.json(
        { error: "Missing address or payment method" },
        { status: 400 },
      );

    // Get Customer_ID
    const [custRows]: any = await db.query(
      "SELECT Customer_ID FROM Customer WHERE userId = ?",
      [decoded.userId],
    );

    if (!custRows || custRows.length === 0)
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );

    const customerId = custRows[0].Customer_ID;

    // Validate menu items
    const menuIds = items.map((it) => it.id);
    const [menuRows]: any = await db.query(
      `SELECT Menu_ID, Price, Restaurant_ID FROM Menu WHERE Menu_ID IN (${menuIds
        .map(() => "?")
        .join(",")})`,
      menuIds,
    );

    if (menuRows.length !== menuIds.length)
      return NextResponse.json(
        { error: "Some menu items are invalid" },
        { status: 400 },
      );

    const restaurantIds = [
      ...new Set(menuRows.map((m: any) => m.Restaurant_ID)),
    ];
    if (restaurantIds.length !== 1)
      return NextResponse.json(
        { error: "Items must be from same restaurant" },
        { status: 400 },
      );

    const restaurantId = restaurantIds[0];

    // Calculate total
    let total = 0;
    const map = new Map<number, any>();
    for (const m of menuRows) map.set(m.Menu_ID, m);

    for (const it of items) {
      const data = map.get(it.id);
      total += Number(data.Price) * Number(it.quantity);
    }

    // Create Payment
    const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";
    const [paymentResult]: any = await db.query(
      `INSERT INTO Payment (Amount, Payment_Method, Date, Status) VALUES (?, ?, CURDATE(), ?)`,
      [total.toFixed(2), paymentMethod, paymentStatus],
    );

    const paymentId = paymentResult.insertId;

    // Create Customer_Order
    const [orderResult]: any = await db.query(
      `INSERT INTO Customer_Order (Status, Customer_ID, Address_ID, Restaurant_ID, Payment_ID)
       VALUES (?, ?, ?, ?, ?)`,
      ["Placed", customerId, addressId, restaurantId, paymentId],
    );

    const orderId = orderResult.insertId;

    // Insert order items WITH quantity
    for (const it of items) {
      await db.query(
        `INSERT INTO Order_Contains (Order_ID, Menu_ID, Quantity) VALUES (?, ?, ?)`,
        [orderId, it.id, it.quantity],
      );
    }

    return NextResponse.json({
      message: "Order placed",
      orderId,
      total,
    });
  } catch (err) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 },
    );
  }
}
