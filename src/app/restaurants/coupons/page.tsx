// src/app/restaurants/coupons/page.tsx
"use client";

import { useEffect, useState } from "react";

type Coupon = {
  Coupon_ID: number;
  Discount: string | number;
  Expiry: string | null;
};

export default function RestaurantCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [discount, setDiscount] = useState("");
  const [expiry, setExpiry] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function loadCoupons() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/restaurant/coupons");
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch coupons");
      }
      setCoupons(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Load coupons error:", err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCoupons();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const dVal = Number(discount);
    if (!dVal || isNaN(dVal) || dVal <= 0) {
      setError("Enter a valid discount percentage.");
      return;
    }
    if (!expiry) {
      setError("Expiry date is required.");
      return;
    }

    try {
      const res = await fetch("/api/restaurant/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discount: dVal,
          expiry,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create coupon");
      }

      setSuccess("Coupon created.");
      setDiscount("");
      setExpiry("");
      await loadCoupons();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Create coupon error:", err);
      setError(msg);
    }
  }

  async function handleDelete(id: number) {
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/restaurant/coupons", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ couponId: id }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete coupon");
      }

      setSuccess("Coupon deleted.");
      setCoupons((prev) => prev.filter((c) => c.Coupon_ID !== id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Delete coupon error:", err);
      setError(msg);
    }
  }

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Manage Coupons
        </h1>

        {/* Messages */}
        {error && (
          <p className="mb-4 text-sm text-red-600 border border-red-200 bg-red-50 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
        {success && (
          <p className="mb-4 text-sm text-green-600 border border-green-200 bg-green-50 rounded-lg px-3 py-2">
            {success}
          </p>
        )}

        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-8"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Discount (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g. 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry date
            </label>
            <input
              type="date"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900 focus:ring-2 focus:ring-orange-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className="h-[42px] md:h-auto bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg px-4 py-2 mt-2 md:mt-0"
          >
            Add Coupon
          </button>
        </form>

        {/* List coupons */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Existing Coupons
          </h2>

          {loading ? (
            <p className="text-gray-600">Loading coupons...</p>
          ) : coupons.length === 0 ? (
            <p className="text-gray-500">
              No coupons yet. Create your first coupon above.
            </p>
          ) : (
            <div className="space-y-3">
              {coupons.map((c) => (
                <div
                  key={c.Coupon_ID}
                  className="flex justify-between items-center bg-orange-50 border border-orange-100 rounded-xl px-4 py-3"
                >
                  <div>
                    <div className="font-semibold text-gray-900">
                      {Number(c.Discount).toFixed(2)}% off
                    </div>
                    <div className="text-sm text-gray-600">
                      {c.Expiry
                        ? `Expires on ${new Date(c.Expiry).toLocaleDateString()}`
                        : "No expiry"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.Coupon_ID)}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
