"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderSummary {
  Order_ID: number;
  Status: string;
  Restaurant_Name: string;
  Amount: number;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/users/orders");
        const data = await res.json();

        if (res.ok && Array.isArray(data.orders)) {
          setOrders(data.orders);
        } else {
          console.error("Invalid orders response:", data);
        }
      } catch (err) {
        console.error("Error loading orders:", err);
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
        You have no orders yet.
      </div>
    );

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-black">My Orders</h2>

        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order.Order_ID}
              href={`/users/order/success?orderId=${order.Order_ID}`}
              className="block bg-orange-50 hover:bg-orange-100 p-4 rounded-xl transition"
            >
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    Order #{order.Order_ID}
                  </p>
                  <p className="text-gray-600">{order.Restaurant_Name}</p>
                  <p
                    className={
                      order.Status === "Delivered"
                        ? "text-green-600 mt-1 font-medium"
                        : "text-orange-600 mt-1 font-medium"
                    }
                  >
                    {order.Status}
                  </p>
                </div>

                <div className="text-right text-gray-900 font-bold">
                  ₹{Number(order.Amount).toFixed(2)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
