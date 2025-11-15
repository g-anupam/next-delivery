"use client";

import { useEffect, useState } from "react";

type EarningsResponse = {
  today: number;
  month: number;
  lifetime: number;
};

export default function RestaurantDashboard() {
  const [stats, setStats] = useState<EarningsResponse>({
    today: 0,
    month: 0,
    lifetime: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEarnings() {
      try {
        const res = await fetch("/api/restaurants/earnings");
        if (!res.ok) {
          throw new Error("Failed to fetch earnings");
        }
        const data = await res.json();
        setStats({
          today: data.today || 0,
          month: data.month || 0,
          lifetime: data.lifetime || 0,
        });
      } catch (err) {
        console.error("Earnings fetch failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEarnings();
  }, []);

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Restaurant Dashboard
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Today's Earnings</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? "₹0.00" : formatAmount(stats.today)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">This Month</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? "₹0.00" : formatAmount(stats.month)}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 border border-gray-100">
          <div className="text-gray-500 text-sm mb-1">Lifetime Earnings</div>
          <div className="text-3xl font-bold text-gray-900">
            {loading ? "₹0.00" : formatAmount(stats.lifetime)}
          </div>
        </div>
      </div>
    </div>
  );
}
