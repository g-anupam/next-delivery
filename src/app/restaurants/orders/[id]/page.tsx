"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  Menu_ID: number;
  Item_Name: string;
  Price: number | string;
  Quantity: number;
}

interface OrderDetailResponse {
  order: {
    Order_ID: number;
    Status: string;
    Amount?: number;
    Payment_Method?: string;
    Payment_Status?: string;
    Address_First_line?: string | null;
    Address_Second_line?: string | null;
    City?: string | null;
    Pincode?: string | null;
    Customer_Name?: string;
    Customer_Email?: string;
  };
  items: OrderItem[];
}

export default function RestaurantOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<OrderDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const orderId = Number(id);

  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        const res = await fetch(`/api/restaurant/orders/${orderId}`);
        const json = await res.json();
        if (res.ok) {
          setData(json);
        } else {
          console.error("Failed to fetch order:", json);
          setErrorMsg(json.error || "Failed to fetch order");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg("Failed to fetch order");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!orderId || !data) return;

    setUpdating(true);
    setErrorMsg("");

    try {
      const res = await fetch(`/api/restaurant/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to update status");
      }

      setData({
        ...data,
        order: { ...data.order, Status: newStatus },
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update";
      console.error(err);
      setErrorMsg(msg);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading order...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Order not found
      </div>
    );
  }

  const { order, items } = data;

  const nextActions = getNextActions(order.Status);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow p-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.Order_ID}
            </h1>
            <p className="text-gray-600">
              Status: <span className="font-medium">{order.Status}</span>
            </p>
          </div>
          <Link
            href="/restaurants/orders"
            className="text-sm text-orange-600 hover:underline"
          >
            ← Back to Orders
          </Link>
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        {/* Customer Info */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Customer</h2>
          <div className="text-sm text-gray-700">
            <div>{order.Customer_Name || "Customer"}</div>
            {order.Customer_Email && (
              <div className="text-gray-500">{order.Customer_Email}</div>
            )}
          </div>
        </section>

        {/* Address */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            Delivery Address
          </h2>
          <div className="text-sm text-gray-700 space-y-1">
            {order.Address_First_line && <div>{order.Address_First_line}</div>}
            {order.Address_Second_line && (
              <div>{order.Address_Second_line}</div>
            )}
            {(order.City || order.Pincode) && (
              <div>
                {order.City} {order.Pincode && `- ${order.Pincode}`}
              </div>
            )}
          </div>
        </section>

        {/* Items */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Items</h2>
          <div className="space-y-2">
            {items.map((it) => (
              <div
                key={it.Menu_ID}
                className="flex justify-between text-sm text-gray-800"
              >
                <div>
                  {it.Item_Name} × {it.Quantity}
                </div>
                <div>
                  ₹{(Number(it.Price) * Number(it.Quantity)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Payment */}
        <section className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Payment
            </h2>
            <div className="text-sm text-gray-700">
              <div>Method: {order.Payment_Method || "N/A"}</div>
              {order.Payment_Status && (
                <div className="text-gray-500 text-xs">
                  Status: {order.Payment_Status}
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500">Total</div>
            <div className="text-xl font-bold text-gray-900">
              ₹
              {order.Amount
                ? Number(order.Amount).toFixed(2)
                : calculateTotal(items)}
            </div>
          </div>
        </section>

        {/* Status Actions */}
        {nextActions.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Update Status
            </h2>
            <div className="flex flex-wrap gap-2">
              {nextActions.map((act) => (
                <button
                  key={act.status}
                  disabled={updating}
                  onClick={() => handleStatusUpdate(act.status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    updating
                      ? "bg-gray-300 text-gray-600"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function calculateTotal(items: OrderItem[]): string {
  const total = items.reduce(
    (sum, it) => sum + Number(it.Price) * Number(it.Quantity),
    0,
  );
  return total.toFixed(2);
}

function getNextActions(status: string): { status: string; label: string }[] {
  if (status === "Placed") {
    return [{ status: "Accepted", label: "Accept Order" }];
  }
  if (status === "Accepted") {
    return [{ status: "Preparing", label: "Start Preparing" }];
  }
  if (status === "Preparing") {
    return [{ status: "Ready for Pickup", label: "Mark Ready for Pickup" }];
  }
  return [];
}
