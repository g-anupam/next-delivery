"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface RestaurantOrderCard {
  Order_ID: number;
  Status: string;
  Amount: number | string;
  Payment_Status?: string;
  Payment_Method?: string;
  Customer_Name: string;
  Address_First_line?: string | null;
  Address_Second_line?: string | null;
  City?: string | null;
  Pincode?: string | null;
}

export default function RestaurantOrdersPage() {
  const [orders, setOrders] = useState<RestaurantOrderCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/restaurant/orders");
        const data = await res.json();

        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Invalid orders response:", data);
        }
      } catch (err) {
        console.error("Error fetching restaurant orders:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading orders...
      </div>
    );

  if (orders.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        No orders yet.
      </div>
    );

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-gray-900">
          Incoming Orders
        </h1>

        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((o) => (
            <Link
              key={o.Order_ID}
              href={`/restaurants/orders/${o.Order_ID}`}
              className="block bg-white rounded-xl shadow hover:shadow-lg transition p-4 border border-orange-100"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm text-gray-500">Order #{o.Order_ID}</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {o.Customer_Name}
                  </p>
                </div>

                <StatusBadge status={o.Status} />
              </div>

              <div className="text-sm text-gray-700 mb-2">
                {o.Address_First_line && <div>{o.Address_First_line}</div>}
                {o.Address_Second_line && <div>{o.Address_Second_line}</div>}
                {(o.City || o.Pincode) && (
                  <div>
                    {o.City} {o.Pincode && `- ${o.Pincode}`}
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center mt-2">
                <div className="text-gray-700 text-sm">
                  {o.Payment_Method && <div>Payment: {o.Payment_Method}</div>}
                  {o.Payment_Status && (
                    <div className="text-xs text-gray-500">
                      Payment Status: {o.Payment_Status}
                    </div>
                  )}
                </div>
                <div className="text-lg font-bold text-gray-900">
                  ₹{Number(o.Amount).toFixed(2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let bg = "bg-gray-200 text-gray-800";

  if (status === "Placed") bg = "bg-blue-100 text-blue-700";
  else if (status === "Accepted") bg = "bg-indigo-100 text-indigo-700";
  else if (status === "Preparing") bg = "bg-yellow-100 text-yellow-700";
  else if (status === "Ready for Pickup") bg = "bg-green-100 text-green-700";
  else if (status === "Out for Delivery") bg = "bg-orange-100 text-orange-700";
  else if (status === "Delivered") bg = "bg-emerald-100 text-emerald-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bg}`}>
      {status}
    </span>
  );
}
