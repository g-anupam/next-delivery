// src/app/checkout/page.tsx
"use client";

import { useCart } from '@/lib/CartContext';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';

// Re-using the DUMMY_RESTAURANTS list to get the restaurant name by ID
// In a real app, this data would be fetched from the database/API.
const DUMMY_RESTAURANTS = [
  { id: 1, name: "The Burger Spot" },
  { id: 2, name: "Szechuan Delight" },
  { id: 3, name: "Pizzeria Italiana" },
  { id: 4, name: "Taco Tuesday" },
  { id: 5, name: "Pho Real" },
];

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart, removeFromCart, decrementQuantity, addToCart } = useCart();
  const totalPrice = getTotalPrice();

  // 1. Group items by restaurant ID
  const groupedCartItems = cart.reduce((acc, item) => {
    const restaurantName = DUMMY_RESTAURANTS.find(r => r.id === item.restaurantId)?.name || `Restaurant #${item.restaurantId}`;
    
    if (!acc[restaurantName]) {
      acc[restaurantName] = {
        items: [],
        subtotal: 0,
        restaurantId: item.restaurantId,
      };
    }
    
    acc[restaurantName].items.push(item);
    acc[restaurantName].subtotal += item.price * item.quantity;
    
    return acc;
  }, {} as Record<string, { items: typeof cart; subtotal: number; restaurantId: number }>);


  // Get an array of the grouped carts for mapping
  const restaurantGroups = Object.keys(groupedCartItems).map(key => groupedCartItems[key]);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8"
      >
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b pb-4">
          Review Your Order
        </h1>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-xl text-gray-600 mb-4">Your cart is empty!</p>
            <Link href="/restaurants" className="text-orange-600 hover:text-orange-700 transition font-medium">
              Start ordering delicious food &rarr;
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items Grouped by Restaurant */}
            <div className="space-y-10">
              {restaurantGroups.map((group, index) => (
                <div key={index} className="border border-gray-200 rounded-xl overflow-hidden shadow-lg">
                  <div className="bg-orange-50 p-4 border-b border-orange-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order from: {DUMMY_RESTAURANTS.find(r => r.id === group.restaurantId)?.name || `Restaurant #${group.restaurantId}`}
                    </h2>
                  </div>
                  
                  {/* Items List */}
                  <div className="p-4 space-y-3">
                    {group.items.map((item) => (
                      <div 
                        key={`${item.restaurantId}-${item.id}`} 
                        className="flex justify-between items-center bg-white p-3 border-b last:border-b-0"
                      >
                        {/* Item Name */}
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        </div>
                        
                        {/* Quantity Counter in Cart */}
                        <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2 border border-orange-300 rounded-lg">
                                <button
                                    onClick={() => decrementQuantity(item.id, item.restaurantId)}
                                    className="p-1 text-orange-600 hover:bg-orange-50 rounded-l-lg transition"
                                    aria-label="Remove one item"
                                >
                                    {/* ⭐️ FIXED: Using Unicode minus sign ⭐️ */}
                                    -
                                </button>
                                <span className="font-semibold text-gray-900 text-lg">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, restaurantId: item.restaurantId })}
                                    className="p-1 text-orange-600 hover:bg-orange-50 rounded-r-lg transition"
                                    aria-label="Add one item"
                                >
                                    {/* ⭐️ FIXED: Using Unicode plus sign ⭐️ */}
                                    +
                                </button>
                            </div>

                            {/* Item Subtotal */}
                            <span className="w-20 text-right text-xl font-bold text-orange-600">
                                ${(item.price * item.quantity).toFixed(2)}
                            </span>

                            {/* Remove Button (Full removal) */}
                            <button
                                onClick={() => removeFromCart(item.id, item.restaurantId)}
                                className="p-2 text-red-500 hover:bg-red-100 rounded-full transition"
                                aria-label="Remove item completely"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Group Subtotal */}
                  <div className="bg-orange-100/50 p-4 flex justify-between font-bold text-xl rounded-b-xl border-t border-orange-200">
                    <span>Subtotal:</span>
                    <span className="text-orange-700">${group.subtotal.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Global Totals and Action Buttons */}
            <div className="mt-8 pt-6 border-t border-gray-400">
              <div className="flex justify-between items-center text-3xl font-extrabold mb-6">
                <span>Grand Total:</span>
                <span className="text-green-600">${totalPrice.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between gap-4">
                <button
                  onClick={clearCart}
                  className="border border-gray-400 text-gray-700 hover:bg-gray-100 px-6 py-3 rounded-xl text-lg transition flex-1"
                >
                  Clear Entire Cart
                </button>
                <button
                  // This button will eventually handle payment submission
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl text-lg shadow-lg transition flex-1 font-bold"
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}