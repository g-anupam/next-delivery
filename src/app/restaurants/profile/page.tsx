"use client";

import { motion } from "framer-motion";

export default function RestaurantProfilePage() {
  return (
    <div className="max-w-3xl mx-auto">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-4xl font-extrabold text-gray-900 mb-6"
      >
        Profile
      </motion.h1>

      <p className="text-gray-700">
        View and edit your restaurant’s details here.
      </p>

      <div className="mt-10 bg-white p-8 rounded-2xl shadow text-gray-600">
        Profile editing coming soon.
      </div>
    </div>
  );
}
