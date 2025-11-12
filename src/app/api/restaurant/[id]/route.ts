import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const cookie = req.headers.get("cookie");
    const token = cookie?.split("token=")[1]?.split(";")[0];
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, JWT_SECRET) as {
      userId: number;
      role: string;
    };
    if (decoded.role !== "restaurant") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { name, description, price } = await req.json();
    await db.query(
      "UPDATE Menu SET Item_Name = ?, Item_Description = ?, Price = ? WHERE Menu_ID = ?",
      [name, description, price, params.id],
    );

    return NextResponse.json({ message: "Menu item updated successfully" });
  } catch (err) {
    console.error("Error updating menu item:", err);
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  try {
    await db.query("DELETE FROM Menu WHERE Menu_ID = ?", [params.id]);
    return NextResponse.json({ message: "Menu item deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu item:", err);
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 },
    );
  }
}
