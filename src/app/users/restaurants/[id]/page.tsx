"use client";

import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import AddToCartButton from "@/components/AddToCartButton";

type Restaurant = {
  Restaurant_ID: number;
  Restaurant_Name: string;
  City: string;
  Pincode: string;
  Address_First_line: string;
  Address_Second_line: string | null;
  Phone: string;
  Email: string;
};

type MenuItem = {
  Menu_ID: number;
  Item_Name: string;
  Item_Description: string | null;
  Price: number;
};

export default function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Unwrap params (Next.js 15)
  const { id } = use(params);

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRestaurantAndMenu() {
      try {
        // Fetch restaurant
        const restaurantRes = await fetch(`/api/restaurants/${id}`);
        if (!restaurantRes.ok) throw new Error("Failed to fetch restaurant");
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);

        // Fetch menu
        const menuRes = await fetch(`/api/restaurants/${id}/menu`);
        const menuData = await menuRes.json();

        if (Array.isArray(menuData)) setMenu(menuData);
        else setMenu([]);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchRestaurantAndMenu();
  }, [id]);

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading restaurant details...
      </div>
    );
  }

  // Not found UI
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
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
    <div className="min-h-screen bg-orange-50 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl"
      >
        {/* Header */}
        <div className="relative h-64 bg-gray-200 rounded-t-2xl flex items-center justify-center">
          [Header Image for {restaurant.Restaurant_Name}]
          <Link
            href="/users/restaurants"
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition shadow-lg"
          >
            &larr;
          </Link>
        </div>

        {/* Restaurant Info */}
        <div className="p-8 border-b border-gray-200">
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

        {/* Menu */}
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Menu</h2>

          {menu.length > 0 ? (
            <div className="space-y-4">
              {menu.map((item) => (
                <div
                  key={item.Menu_ID}
                  className="flex justify-between items-center bg-orange-50 p-4 rounded-xl hover:bg-orange-100 transition"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {item.Item_Name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {item.Item_Description || "No description available"}
                    </p>
                    <span className="text-lg font-bold text-orange-600 block mt-1">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                        minimumFractionDigits: 2,
                      }).format(Number(item.Price))}
                    </span>
                  </div>

                  {/* ⭐ REAL ADD TO CART BUTTON */}
                  <AddToCartButton
                    itemId={item.Menu_ID}
                    itemName={item.Item_Name}
                    itemPrice={Number(item.Price)}
                    restaurantId={restaurant.Restaurant_ID}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 text-lg">
              No menu items available for this restaurant.
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
