"use client";

import { useCart } from "@/lib/CartContext";
import { X, AlertTriangle } from "lucide-react";

// Re-using the DUMMY_RESTAURANTS list to get the restaurant name by ID
const DUMMY_RESTAURANTS = [
  { id: 1, name: "The Burger Spot" },
  { id: 2, name: "Szechuan Delight" },
  { id: 3, name: "Pizzeria Italiana" },
  { id: 4, name: "Taco Tuesday" },
  { id: 5, name: "Pho Real" },
];

export default function RestaurantConflictDialog() {
  const { cartConflict, resolveConflict } = useCart();

  if (!cartConflict) return null;

  // Get current and conflicting restaurant names for display
  const currentRestaurantName = DUMMY_RESTAURANTS.find(
    (r) => r.id === cartConflict.currentRestaurantId
  )?.name || `Restaurant #${cartConflict.currentRestaurantId}`;

  const newItemRestaurantName = DUMMY_RESTAURANTS.find(
    (r) => r.id === cartConflict.item.restaurantId
  )?.name || `New Restaurant #${cartConflict.item.restaurantId}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 p-6 transform transition-all scale-100 duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b pb-3 mb-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-bold text-gray-900">Order Conflict</h2>
          </div>
          <button
            onClick={() => resolveConflict(false)}
            className="text-gray-400 hover:text-gray-600 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <p className="text-gray-700 mb-4">
          You currently have items in your cart from **{currentRestaurantName}**.
        </p>
        <p className="font-semibold text-lg text-orange-600 mb-6">
          You can only order from one restaurant at a time.
        </p>

        <p className="text-gray-700 mb-6">
          Do you want to clear your current cart and add the new item, **"{cartConflict.item.name}"** from **{newItemRestaurantName}**?
        </p>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            onClick={() => resolveConflict(false)}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-100 py-3 rounded-xl font-medium transition"
          >
            Cancel (Keep Current Cart)
          </button>
          <button
            onClick={() => resolveConflict(true)}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold transition"
          >
            Yes, Clear Cart and Add Item
          </button>
        </div>
      </div>
    </div>
  );
}