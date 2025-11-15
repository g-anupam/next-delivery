// src/app/users/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";

export default function PaymentPage() {
  const search = useSearchParams();
  const totalParam = search.get("total");
  const addressId = search.get("addressId");
  const couponIdParam = search.get("couponId");

  const { cart, clearCart, getTotalPrice } = useCart();
  const router = useRouter();

  const [method, setMethod] = useState<"UPI" | "Card" | "COD">("UPI");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressId) {
      alert("No address selected.");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 1500));

      const items = cart.map((it) => ({
        id: it.id,
        quantity: it.quantity,
      }));

      const body: {
        items: { id: number; quantity: number }[];
        addressId: number;
        paymentMethod: string;
        couponId?: number;
      } = {
        items,
        addressId: Number(addressId),
        paymentMethod: method,
      };

      if (couponIdParam) {
        const parsed = Number(couponIdParam);
        if (!isNaN(parsed)) {
          body.couponId = parsed;
        }
      }

      const res = await fetch("/api/users/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Order failed");
      }

      clearCart();
      router.push(`/users/order/success?orderId=${data.orderId}`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Payment failed";
      console.error("Payment/create order error:", err);
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-orange-50">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-black">Payment</h2>

        <div className="mb-4">
          <div className="font-medium text-black">Amount (approx)</div>
          <div className="text-2xl font-bold text-black">
            ₹
            {totalParam
              ? Number(totalParam).toFixed(2)
              : getTotalPrice().toFixed(2)}
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-900">
              Payment method
            </label>
            <select
              value={method}
              onChange={(e) =>
                setMethod(e.target.value as "UPI" | "Card" | "COD")
              }
              className="w-full border p-2 rounded text-gray-600"
            >
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>

          {method === "UPI" && (
            <div>
              <label className="block text-sm mb-1 text-gray-600">UPI ID</label>
              <input
                className="w-full border p-2 rounded"
                placeholder="example@upi"
              />
            </div>
          )}

          {method === "Card" && (
            <>
              <div>
                <label className="block text-sm mb-1 text-gray-600">
                  Card number
                </label>
                <input
                  className="w-full border p-2 rounded"
                  placeholder="xxxx xxxx xxxx xxxx"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="border p-2 rounded" placeholder="MM/YY" />
                <input className="border p-2 rounded" placeholder="CVC" />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-orange-300"
            >
              {loading
                ? "Processing..."
                : method === "COD"
                  ? "Place Order (COD)"
                  : "Pay & Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
