import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { email, password, role, extraData } = data;

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    // Build name based on role
    let name = "";
    if (role === "customer" || role === "driver") {
      const { firstName, middleName, lastName } = extraData || {};
      name = [firstName, middleName, lastName].filter(Boolean).join(" ");
    } else if (role === "restaurant") {
      name = extraData?.restaurantName || "";
    }

    if (!name) {
      return NextResponse.json(
        { message: "Name information missing" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare flexible params
    let e1 = null,
      e2 = null,
      e3 = null,
      e4 = null,
      e5 = null;

    if (role === "customer") {
      e1 = extraData.phone;
      e2 = extraData.firstName;
      e3 = extraData.middleName;
      e4 = extraData.lastName;
    } else if (role === "restaurant") {
      e1 = extraData.restaurantName;
      e2 = extraData.phone;
      e3 = extraData.address1;
      e4 = extraData.address2;
      e5 = extraData.city;
    } else if (role === "driver") {
      const fullName = [
        extraData.firstName,
        extraData.middleName,
        extraData.lastName,
      ]
        .filter(Boolean)
        .join(" ");

      e1 = fullName;
      e2 = extraData.vehicleName;
      e3 = extraData.vehicleNumber;
    }

    // Call stored procedure
    const [result]: any = await db.query(
      `CALL sp_create_user(?, ?, ?, ?, ?, ?, ?, ?, ?, @uid);`,
      [name, email, hashedPassword, role, e1, e2, e3, e4, e5],
    );

    // Read returned OUT param
    const [[{ uid }]]: any = await db.query("SELECT @uid AS uid;");

    return NextResponse.json(
      { message: "Signup successful", userId: uid },
      { status: 201 },
    );
  } catch (err: any) {
    console.error("Signup error:", err);
    return NextResponse.json(
      { message: "Signup failed", error: err.message },
      { status: 500 },
    );
  }
}
