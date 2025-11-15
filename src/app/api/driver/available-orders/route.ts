import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const [orders]: any = await db.query(
      `
      SELECT
        co.Order_ID,
        co.Status,
        r.Restaurant_Name,
        da.Address_First_Line,
        da.Address_Second_Line,
        da.City,
        da.Pincode
      FROM Customer_Order co
      JOIN Restaurant r ON co.Restaurant_ID = r.Restaurant_ID
      JOIN Delivery_Address da ON co.Address_ID = da.Address_ID
      WHERE co.Status = 'Ready for Pickup'
        AND co.Driver_ID IS NULL
      ORDER BY co.Order_ID ASC
      `,
    );

    return NextResponse.json(orders || []);
  } catch (err: any) {
    console.error("Driver orders fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch available orders" },
      { status: 500 },
    );
  }
}
