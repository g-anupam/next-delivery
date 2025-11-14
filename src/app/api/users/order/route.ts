// src/app/api/users/order/route.ts
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
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role?: string;
    };
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await req.json();
    const items: ItemPayload[] = body.items;
    const addressId: number = body.addressId;
    const paymentMethod: string = body.paymentMethod;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "No items provided" }, { status: 400 });
    }
    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing address or payment method" },
        { status: 400 },
      );
    }

    // 1) Get Customer_ID for this user
    const [customerRows]: any = await db.query(
      "SELECT Customer_ID FROM Customer WHERE userId = ?",
      [decoded.userId],
    );
    if (!Array.isArray(customerRows) || customerRows.length === 0) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 },
      );
    }
    const customerId = customerRows[0].Customer_ID;

    // 2) Validate items: fetch menu entries and ensure all from same restaurant
    const menuIds = items.map((it) => it.id);
    const [menuRows]: any = await db.query(
      `SELECT Menu_ID, Price, Restaurant_ID FROM Menu WHERE Menu_ID IN (${menuIds.map(() => "?").join(",")})`,
      menuIds,
    );

    if (!Array.isArray(menuRows) || menuRows.length !== menuIds.length) {
      return NextResponse.json(
        { error: "Some menu items are invalid" },
        { status: 400 },
      );
    }

    // Check consistent restaurant
    const restaurantIds = Array.from(
      new Set(menuRows.map((r: any) => r.Restaurant_ID)),
    );
    if (restaurantIds.length !== 1) {
      return NextResponse.json(
        { error: "All items must belong to a single restaurant" },
        { status: 400 },
      );
    }
    const restaurantId = restaurantIds[0];

    // 3) Calculate total server-side
    let total = 0;
    const menuById = new Map<number, any>();
    for (const r of menuRows) menuById.set(Number(r.Menu_ID), r);

    for (const it of items) {
      const menu = menuById.get(it.id);
      if (!menu) {
        return NextResponse.json(
          { error: `Menu item ${it.id} not found` },
          { status: 400 },
        );
      }
      const price = Number(menu.Price);
      total += price * Number(it.quantity || 0);
    }

    // 4) Create Payment row (mocked, status 'Paid' for Card/UPI, 'Pending' for COD)
    const paymentStatus = paymentMethod === "COD" ? "Pending" : "Paid";
    const [paymentResult]: any = await db.query(
      `INSERT INTO Payment (Amount, Payment_Method, Date, Status) VALUES (?, ?, CURDATE(), ?)`,
      [total.toFixed(2), paymentMethod, paymentStatus],
    );
    const paymentId = paymentResult.insertId;

    // 5) Create Customer_Order row (Status = Placed)
    const [orderResult]: any = await db.query(
      `INSERT INTO Customer_Order (Status, Customer_ID, Address_ID, Restaurant_ID, Payment_ID) VALUES (?, ?, ?, ?, ?)`,
      ["Placed", customerId, addressId, restaurantId, paymentId],
    );
    const orderId = orderResult.insertId;

    // 6) Insert rows into Order_Contains
    const insertPromises = items.map((it) =>
      db.query(`INSERT INTO Order_Contains (Order_ID, Menu_ID) VALUES (?, ?)`, [
        orderId,
        it.id,
      ]),
    );
    await Promise.all(insertPromises);

    return NextResponse.json({ message: "Order placed", orderId, total });
  } catch (err: unknown) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: "Failed to place order" },
      { status: 500 },
    );
  }
}
