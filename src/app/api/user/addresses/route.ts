import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can access addresses" },
        { status: 403 },
      );
    }

    // Get Customer_ID using userId
    const [customerRows] = await db.query(
      "SELECT Customer_ID FROM Customer WHERE userId = ?",
      [decoded.userId],
    );

    if (!Array.isArray(customerRows) || customerRows.length === 0) {
      return NextResponse.json({ addresses: [] });
    }

    const customerId = customerRows[0].Customer_ID;

    // Fetch addresses
    const [rows] = await db.query(
      `SELECT da.Address_ID, da.Address_First_Line, da.Address_Second_Line, da.City, da.Pincode
       FROM Delivery_Address da
       JOIN Customer_Address ca ON da.Address_ID = ca.Address_ID
       WHERE ca.Customer_ID = ?`,
      [customerId],
    );

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { line1, line2, city, pincode } = body;

    const cookieStore = await cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };

    if (decoded.role !== "customer") {
      return NextResponse.json(
        { error: "Only customers can add addresses" },
        { status: 403 },
      );
    }

    // Lookup customer
    const [customerRows] = await db.query(
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

    // Insert address
    const [addressRes]: any = await db.query(
      `INSERT INTO Delivery_Address (Address_First_Line, Address_Second_Line, City, Pincode)
       VALUES (?, ?, ?, ?)`,
      [line1, line2 || null, city, pincode],
    );

    const newAddressId = addressRes.insertId;

    // Link to customer
    await db.query(
      "INSERT INTO Customer_Address (Customer_ID, Address_ID) VALUES (?, ?)",
      [customerId, newAddressId],
    );

    return NextResponse.json({
      message: "Address added",
      addressId: newAddressId,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 },
    );
  }
}
