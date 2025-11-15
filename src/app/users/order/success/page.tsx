"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface OrderDetail {
  order: any;
  items: {
    Menu_ID: number;
    Item_Name: string;
    Price: number;
    Quantity?: number;
  }[];
  payment: any;
  address: any;
}

export default function OrderSuccessPage() {
  const search = useSearchParams();
  const orderId = search.get("orderId");

  const [data, setData] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  // rating states
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    (async () => {
      try {
        const res = await fetch(`/api/users/orders/${orderId}`);
        const d = await res.json();
        setData(d);

        // Check if already rated
        if (d?.order?.Order_ID) {
          const r = await fetch(`/api/users/rating/${d.order.Order_ID}`);
          const rd = await r.json();
          if (rd?.rating) {
            setAlreadyRated(true);
            setRating(rd.rating);
          }
        }
      } catch (err) {
        console.error("Fetch order error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  async function submitRating() {
    if (!data) return;
    const restaurantId = data.order.Restaurant_ID;

    setSubmitting(true);
    try {
      const res = await fetch("/api/users/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId,
          orderId: data.order.Order_ID,
          rating,
        }),
      });

      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "Rating failed");

      setAlreadyRated(true);
    } catch (err) {
      console.error(err);
      alert("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!data?.order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Order not found
      </div>
    );
  }

  const { order, items, payment, address } = data;

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-2 text-black">Order Confirmed</h2>
        <p className="text-gray-600 mb-4">
          Order #{order.Order_ID} — Status: {order.Status}
        </p>

        {/* Delivery Address */}
        <div className="mb-4">
          <h3 className="font-semibold text-black">Delivery Address</h3>
          {address ? (
            <div className="text-sm text-gray-700">
              <div>{address.Address_First_Line}</div>
              {address.Address_Second_Line && (
                <div>{address.Address_Second_Line}</div>
              )}
              <div>
                {address.City} - {address.Pincode}
              </div>
            </div>
          ) : (
            <div className="text-sm">No address info</div>
          )}
        </div>

        {/* Items */}
        <div className="mb-4">
          <h3 className="font-semibold text-black">Items</h3>
          <ul className="space-y-2">
            {items.map((it) => (
              <li
                key={it.Menu_ID}
                className="flex justify-between text-gray-700"
              >
                <div>
                  {it.Item_Name} {it.Quantity ? `× ${it.Quantity}` : ""}
                </div>
                <div>
                  ₹{(Number(it.Price) * Number(it.Quantity || 1)).toFixed(2)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Payment */}
        <div className="mb-4 flex justify-between">
          <div className="font-semibold text-black">Payment</div>
          <div className="text-gray-700">
            {payment
              ? `${payment.Payment_Method} — ₹${Number(payment.Amount).toFixed(
                  2,
                )}`
              : "N/A"}
          </div>
        </div>

        {/* Rating Section — Only after Delivered */}
        {order.Status === "Delivered" && (
          <div className="mt-6 p-4 border rounded-xl bg-gray-50">
            <h3 className="font-semibold text-black mb-2">Rate Your Order</h3>

            {alreadyRated ? (
              <p className="text-green-600 font-medium">
                Thank you! You rated this order {rating} ★
              </p>
            ) : (
              <>
                <div className="flex space-x-3 mb-3">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <span
                      key={num}
                      className={`cursor-pointer text-3xl ${
                        num <= rating ? "text-orange-500" : "text-gray-400"
                      }`}
                      onClick={() => setRating(num)}
                    >
                      ★
                    </span>
                  ))}
                </div>

                <button
                  disabled={rating === 0 || submitting}
                  onClick={submitRating}
                  className={`px-4 py-2 rounded-lg text-white ${
                    rating === 0 || submitting
                      ? "bg-gray-400"
                      : "bg-orange-500 hover:bg-orange-600"
                  }`}
                >
                  {submitting ? "Submitting..." : "Submit Rating"}
                </button>
              </>
            )}
          </div>
        )}

        <div className="mt-4">
          <a href="/users/orders" className="text-orange-600 hover:underline">
            View all orders
          </a>
        </div>
      </div>
    </div>
  );
}
