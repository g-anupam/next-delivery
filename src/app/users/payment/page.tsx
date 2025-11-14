// src/app/users/payment/page.tsx
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";
import { useState } from "react";

export default function PaymentPage() {
  const search = useSearchParams();
  const addressId = search.get("addressId");
  const { cart, clearCart, getTotalPrice } = useCart();
  const router = useRouter();

  const [method, setMethod] = useState<"UPI" | "Card" | "COD">("UPI");
  const [loading, setLoading] = useState(false);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressId) return alert("No address selected.");

    setLoading(true);
    try {
      // mock delay to simulate payment
      await new Promise((res) => setTimeout(res, 1500));

      // Build items payload
      const items = cart.map((it: any) => ({
        id: it.id,
        quantity: it.quantity,
      }));

      const res = await fetch("/api/users/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          addressId: Number(addressId),
          paymentMethod: method,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/users/order/success?orderId=${data.orderId}`);
    } catch (err: any) {
      console.error("Payment/create order error:", err);
      alert(err.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4 text-black">Payment</h2>

        <div className="mb-4">
          <div className="font-medium text-black">Amount</div>
          <div className="text-2xl font-bold text-black">
            ₹{getTotalPrice().toFixed(2)}
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium text-gray-900">
              Payment method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value as any)}
              className="w-full border p-2 rounded text-gray-600"
            >
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="COD">Cash on Delivery</option>
            </select>
          </div>

          {/* mock fields */}
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
                  Card number{" "}
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
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
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
