"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from 'next/navigation'; // ⭐️ ADDED: Import useRouter

export default function Home() {
  const router = useRouter(); // ⭐️ ADDED: Initialize router

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex flex-col">
      {/* Navbar */}
      {/* Hero Section */}
      <main className="flex flex-col md:flex-row flex-1 items-center justify-between px-10 md:px-24 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-xl space-y-6"
        >
          <h1 className="text-5xl md:text-6xl font-bold leading-tight text-gray-900">
            Delicious food,{" "}
            <span className="text-orange-600">delivered fast</span>
          </h1>
          <p className="text-gray-600 text-lg">
            From your favorite restaurants to your doorstep. Order now and enjoy
            the fastest delivery experience in your city.
          </p>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/restaurants')} // ⭐️ UPDATED: Redirect to /restaurants
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition"
            >
              Order Now
            </button>
            <button className="border border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3 rounded-xl text-lg transition">
              Become a Partner
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="mt-12 md:mt-0"
        >
          <Image
            src="/food-delivery.png"
            alt="Food delivery illustration"
            width={1024}
            height={1024}
            className="rounded-2xl shadow-lg"
          />
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} QuickBite. All rights reserved.
      </footer>
    </div>
  );
}