// src/app/restaurants/page.tsx
"use client";

import { useState, useMemo } from "react"; // ⭐️ Import new hooks
import { motion } from "framer-motion";
import Link from "next/link";

// Define the type for a Restaurant for better code safety
type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
};

// Dummy data moved outside the component to avoid re-creation on every render
const DUMMY_RESTAURANTS: Restaurant[] = [
  { id: 1, name: "The Burger Spot", cuisine: "American", rating: 4.5, image: "/restaurant-burger.jpg" },
  { id: 2, name: "Szechuan Delight", cuisine: "Chinese", rating: 4.8, image: "/restaurant-chinese.jpg" },
  { id: 3, name: "Pizzeria Italiana", cuisine: "Italian", rating: 4.2, image: "/restaurant-pizza.jpg" },
  { id: 4, name: "Taco Tuesday", cuisine: "Mexican", rating: 4.6, image: "/restaurant-taco.jpg" },
  { id: 5, name: "Pho Real", cuisine: "Vietnamese", rating: 4.9, image: "/restaurant-pho.jpg" },
];

export default function RestaurantsPage() {
  // ⭐️ 1. STATE: Hook to store the current search term
  const [searchTerm, setSearchTerm] = useState("");

  // ⭐️ 2. FILTERING LOGIC: useMemo to efficiently filter the list
  const filteredRestaurants = useMemo(() => {
    if (!searchTerm) {
      return DUMMY_RESTAURANTS;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return DUMMY_RESTAURANTS.filter((restaurant) =>
      // Checks if the search term is in the restaurant name or cuisine type
      restaurant.name.toLowerCase().includes(lowercasedTerm) ||
      restaurant.cuisine.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm]); // Recalculate only when searchTerm changes

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        {/* Header and Search Bar */}
        <header className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
            Find the perfect QuickBite
          </h1>
          <p className="text-xl text-gray-600">
            Browse restaurants available for delivery in your area.
          </p>

          {/* Simple Search Input */}
          <div className="mt-6 relative rounded-xl shadow-lg bg-white">
            <input
              type="text"
              placeholder="Search by restaurant name or cuisine..."
              // ⭐️ 3. BINDING: Connect input value to state
              value={searchTerm}
              // ⭐️ 4. HANDLER: Update state on every keystroke
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-orange-200 focus:ring-orange-500 focus:border-orange-500 transition duration-150 ease-in-out text-gray-900" 
            />
            
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-lg text-gray-400">🔍</span> 
          </div>
        </header>

        {/* Restaurants Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {/* ⭐️ 5. RENDER: Iterate over the filtered list instead of the full list */}
          {filteredRestaurants.map((restaurant) => (
            <motion.div
              key={restaurant.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 * restaurant.id }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300 transform hover:scale-[1.02]"
            >
              <Link href={`/restaurants/${restaurant.id}`} className="group block">
                {/* Placeholder Image (replace with actual Next.js Image component) */}
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                    [Image for {restaurant.name}]
                </div>
                
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600 transition">
                    {restaurant.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">{restaurant.cuisine}</p>
                  <div className="mt-3 flex items-center">
                    <span className="text-yellow-500 font-bold mr-2">⭐</span>
                    <span className="text-gray-700">{restaurant.rating} Rating</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Fallback for no results */}
          {filteredRestaurants.length === 0 && (
            <p className="col-span-full text-center text-gray-500 text-xl py-10">
              No restaurants found matching "{searchTerm}".
            </p>
          )}
        </section>
      </motion.div>
    </div>
  );
}