"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Restaurant = {
  Restaurant_ID: number;
  Restaurant_Name: string;
  City: string;
  Pincode: string;
  Email: string;
  Phone: string;
};

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchRestaurants() {
      try {
        const res = await fetch("/api/restaurants");
        const data = await res.json();
        setRestaurants(data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    }
    fetchRestaurants();
  }, []);

  const filteredRestaurants = useMemo(() => {
    if (!searchTerm) return restaurants;
    const lower = searchTerm.toLowerCase();
    return restaurants.filter(
      (r) =>
        r.Restaurant_Name.toLowerCase().includes(lower) ||
        r.City.toLowerCase().includes(lower),
    );
  }, [restaurants, searchTerm]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header and Search */}
        <header className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Find the perfect QuickBite
          </h1>
          <p className="text-xl text-gray-700">
            Browse restaurants available for delivery in your area.
          </p>

          <div className="mt-6 relative rounded-xl shadow-lg bg-white mx-auto max-w-xl">
            <input
              type="text"
              placeholder="Search by restaurant name or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-200 focus:ring-orange-500 focus:border-orange-500 transition text-gray-900"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-400">
              🔍
            </span>
          </div>
        </header>

        {/* Restaurants Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredRestaurants.map((r) => (
            <motion.div
              key={r.Restaurant_ID}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]"
            >
              <Link
                href={`/users/restaurants/${r.Restaurant_ID}`}
                className="block group"
              >
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                  [Image for {r.Restaurant_Name}]
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition">
                    {r.Restaurant_Name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{r.City}</p>
                  <div className="mt-3 flex items-center">
                    <span className="text-yellow-500 font-bold mr-2">⭐</span>
                    <span className="text-gray-700">
                      Contact: {r.Phone || "N/A"}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {filteredRestaurants.length === 0 && (
            <p className="col-span-full text-center text-gray-600 text-xl py-10">
              {`No restaurants found matching "${searchTerm}".`}
            </p>
          )}
        </section>
      </motion.div>
    </div>
  );
}
