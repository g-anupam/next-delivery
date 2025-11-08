// src/app/restaurants/[id]/page.tsx
"use client"; // Required for framer-motion

import { motion } from "framer-motion";
import Link from "next/link";
// Removed: import { useCart } from '@/lib/CartContext'; 

// --- Data Structure and Dummy Data (All 5 Restaurants) ---

type MenuItem = {
  id: number;
  name: string;
  price: number;
};

type Restaurant = {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  image: string;
  description: string;
  menu: MenuItem[];
};

const DUMMY_RESTAURANTS: Restaurant[] = [
  { 
    id: 1, 
    name: "The Burger Spot", 
    cuisine: "American", 
    rating: 4.5, 
    image: "/restaurant-burger.jpg",
    description: "Serving up classic American comfort food, from juicy burgers to crispy fries and thick shakes.",
    menu: [
      { id: 101, name: "Classic Cheeseburger", price: 10.99 },
      { id: 102, name: "Spicy Chicken Sandwich", price: 12.50 },
      { id: 103, name: "Truffle Fries", price: 6.00 },
    ]
  },
  { 
    id: 2, 
    name: "Szechuan Delight", 
    cuisine: "Chinese", 
    rating: 4.8, 
    image: "/restaurant-chinese.jpg",
    description: "Authentic Szechuan cuisine with bold, spicy, and unforgettable flavors.",
    menu: [
      { id: 201, name: "Kung Pao Chicken", price: 14.99 },
      { id: 202, name: "Mapo Tofu", price: 13.50 },
      { id: 203, name: "Wonton Soup", price: 7.00 },
    ]
  },
  { 
    id: 3, 
    name: "Pizzeria Italiana", 
    cuisine: "Italian", 
    rating: 4.2, 
    image: "/restaurant-pizza.jpg",
    description: "Hand-tossed, wood-fired pizzas and homemade pasta, just like nonna used to make.",
    menu: [
      { id: 301, name: "Margherita Pizza", price: 16.00 },
      { id: 302, name: "Fettuccine Alfredo", price: 18.50 },
      { id: 303, name: "Garlic Knots (6pc)", price: 5.00 },
    ]
  },
  { 
    id: 4, 
    name: "Taco Tuesday", 
    cuisine: "Mexican", 
    rating: 4.6, 
    image: "/restaurant-taco.jpg",
    description: "Freshly made tortillas and authentic fillings for the perfect Mexican fiesta at home.",
    menu: [
      { id: 401, name: "Carnitas Tacos (3)", price: 11.50 },
      { id: 402, name: "Chicken Burrito Bowl", price: 14.00 },
      { id: 403, name: "Guacamole & Chips", price: 8.50 },
    ]
  },
  { 
    id: 5, 
    name: "Pho Real", 
    cuisine: "Vietnamese", 
    rating: 4.9, 
    image: "/restaurant-pho.jpg",
    description: "Heartwarming and aromatic Vietnamese dishes, specializing in traditional Pho noodle soup.",
    menu: [
      { id: 501, name: "Beef Pho", price: 15.99 },
      { id: 502, name: "Spring Rolls (2)", price: 6.99 },
      { id: 503, name: "Banh Mi Sandwich", price: 10.00 },
    ]
  },
];

interface RestaurantPageProps {
  params: {
    id: string; 
  };
}

// --- Component Definition ---

export default function RestaurantDetailPage({ params }: RestaurantPageProps) {
  // Logic to find restaurant data
  const restaurantId = parseInt(params.id);
  const restaurant = DUMMY_RESTAURANTS.find(r => r.id === restaurantId);

  // Handle case where restaurant is not found
  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-10 bg-white shadow-xl rounded-xl">
          <h1 className="text-3xl font-bold text-red-600 mb-4">404 - Restaurant Not Found</h1>
          <p className="text-gray-600">The restaurant you are looking for does not exist.</p>
          <Link href="/restaurants" className="mt-4 inline-block text-orange-600 hover:text-orange-700 transition font-medium">
            &larr; Go back to Restaurants
          </Link>
        </div>
      </div>
    );
  }

  // Render the restaurant details and menu
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-b-2xl"
      >
        {/* Header/Image Section */}
        <div className="relative h-64 w-full bg-gray-200 rounded-t-2xl flex items-center justify-center overflow-hidden">
          <span className="text-2xl text-gray-500">
            [Header Image for {restaurant.name}]
          </span>
          <Link 
            href="/restaurants" 
            className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-gray-800 hover:bg-white transition shadow-lg"
            aria-label="Go back to restaurant list"
          >
            &larr;
          </Link>
        </div>

        {/* Details Section */}
        <div className="p-8">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl font-extrabold text-gray-900">{restaurant.name}</h1>
            <div className="flex items-center space-x-4 mt-2 mb-4 text-lg">
              <span className="text-orange-600 font-semibold">{restaurant.cuisine}</span>
              <span className="text-yellow-500 font-bold">⭐ {restaurant.rating}</span>
            </div>
            <p className="text-gray-600 italic border-l-4 border-orange-200 pl-4 py-1">{restaurant.description}</p>
          </motion.div>
          
          {/* Menu Section - Renders the dummy menu items */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="mt-10">
            <h2 className="text-3xl font-bold text-gray-900 border-b pb-2 mb-6">Menu</h2>
            <div className="space-y-4">
              {restaurant.menu.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">{item.name}</h3>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-xl font-bold text-orange-600">${item.price.toFixed(2)}</span>
                    <button
                      // ➡️ Placeholder for future Cart Logic
                      onClick={() => alert(`Added ${item.name} to cart!`)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl text-sm shadow-md transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}