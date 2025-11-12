"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

type Restaurant = {
  Restaurant_ID: number;
  Restaurant_Name: string;
  City: string;
  Pincode: string;
  Address_First_line: string;
  Address_Second_line: string;
  Phone: string;
  Email: string;
};

interface RestaurantPageProps {
  params: { id: string };
}

export default function RestaurantDetailPage({ params }: RestaurantPageProps) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurant() {
      try {
        const res = await fetch(`/api/restaurants/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch restaurant");
        const data = await res.json();
        setRestaurant(data);
      } catch (err) {
        console.error("Error fetching restaurant:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurant();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading restaurant details...
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white shadow-xl rounded-xl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">
            404 - Restaurant Not Found
          </h1>
          <Link
            href="/users/restaurants"
            className="text-orange-600 font-medium hover:text-orange-700 transition"
          >
            &larr; Go back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl"
      >
        {/* Header Section */}
        <div className="relative h-64 bg-gray-200 rounded-t-2xl flex items-center justify-center">
          [Header Image for {restaurant.Restaurant_Name}]
          <Link
            href="/users/restaurants"
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition shadow-lg"
          >
            &larr;
          </Link>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <h1 className="text-4xl font-extrabold text-gray-900">
            {restaurant.Restaurant_Name}
          </h1>

          <p className="text-gray-600 italic mt-2">
            {restaurant.Address_First_line}
            {restaurant.Address_Second_line
              ? `, ${restaurant.Address_Second_line}`
              : ""}
            , {restaurant.City} - {restaurant.Pincode}
          </p>

          <div className="mt-4 text-gray-700">
            <p>
              <strong>Phone:</strong> {restaurant.Phone || "N/A"}
            </p>
            <p>
              <strong>Email:</strong> {restaurant.Email || "N/A"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
