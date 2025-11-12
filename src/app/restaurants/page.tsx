"use client";

import { motion } from "framer-motion";

export default function RestaurantDashboardPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-gray-900 mb-6"
      >
        Welcome to your Dashboard
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="text-gray-700 text-lg"
      >
        Here you can manage your active orders, update your menu, and view your
        performance summary.
      </motion.p>

      {/* Placeholder for future dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
          <p className="text-3xl font-bold text-orange-600 mt-2">12</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Completed Orders
          </h3>
          <p className="text-3xl font-bold text-green-600 mt-2">145</p>
        </div>

        <div className="bg-white rounded-2xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">Pending Items</h3>
          <p className="text-3xl font-bold text-yellow-600 mt-2">3</p>
        </div>
      </div>
    </div>
  );
}
