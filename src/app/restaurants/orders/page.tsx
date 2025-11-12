"use client";

import { motion } from "framer-motion";

export default function RestaurantOrdersPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-gray-900 mb-6"
      >
        Orders
      </motion.h1>

      <p className="text-gray-700">
        Track your active and past orders in real-time here.
      </p>

      <div className="mt-10 bg-white p-8 rounded-2xl shadow text-gray-600">
        You currently have no active orders.
      </div>
    </div>
  );
}
