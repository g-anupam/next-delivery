// src/app/drivers/dashboard/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link"; 
import { useRouter } from 'next/navigation'; // ⭐️ ADDED: Import useRouter

// --- MOCK DATA ---
const MOCK_STATS = [
  { label: "Deliveries Today", value: 12, icon: "📦" },
  { label: "Total Earnings", value: "$185.50", icon: "💰" },
  { label: "Avg Delivery Time", value: "22 min", icon: "⏱️" },
];

const MOCK_ORDERS = [
  {
    id: 1001,
    restaurant: "McDonald's",
    pickupTime: "10:30 AM",
    pickupLocation: "Electronic City Phase I",
    distance: "1.5 km",
    status: "New",
  },
  {
    id: 1002,
    restaurant: "Biriyani Point",
    pickupTime: "10:45 AM",
    pickupLocation: "AECS Layout, Singasandra",
    distance: "3.2 km",
    status: "New",
  },
  {
    id: 1003,
    restaurant: "Punjabi Dhaba",
    pickupTime: "11:00 AM",
    pickupLocation: "Wipro Technologies, Keonics",
    distance: "0.8 km",
    status: "New",
  },
];

const MOCK_CURRENT_DELIVERY = {
  id: 1000,
  customer: "Jane Doe",
  restaurant: "Starbucks Coffee",
  pickupAddress: "1st Main Rd, HSR Layout",
  deliveryAddress: "Apartment C-402, BTM Layout",
  status: "En Route to Customer",
  eta: "5 min",
};

// --- NAVBAR COMPONENT ---
const DriverNavbar = () => {
  const router = useRouter(); // ⭐️ ADDED: Initialize router
  const [isOnline, setIsOnline] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleOnlineStatus = () => {
    setIsOnline(!isOnline);
  };
  
  const handleSignOut = async () => {
    // 1. Close the dropdown menu immediately
    setIsProfileMenuOpen(false); 

    // 2. ⭐️ TODO: Implement your actual sign-out logic here ⭐️
    // Example: await fetch('/api/auth/signout', { method: 'POST' });
    console.log("Driver signing out and redirecting...");
    
    // Simulate API delay for better UX (Remove this in production)
    await new Promise(resolve => setTimeout(resolve, 300));

    // 3. Redirect to the main landing page (e.g., '/')
    router.push('/'); 
  };


  return (
    <nav className="sticky top-0 z-10 bg-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo/App Name */}
          <Link href="/drivers/dashboard" className="text-2xl font-extrabold text-orange-500 tracking-wider">
            QuickBite Driver
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/drivers/dashboard" className="text-white hover:text-orange-400 px-3 py-2 text-sm font-medium transition duration-150">
              Dashboard
            </Link>
            <Link href="/drivers/history" className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium transition duration-150">
              Earnings History
            </Link>
          </div>

          {/* Status Toggle & Profile */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleOnlineStatus}
              className={`flex items-center text-sm font-bold py-2 px-4 rounded-full transition-colors duration-300 ${
                isOnline
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-md"
                  : "bg-red-600 hover:bg-red-700 text-white shadow-md"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={`h-2.5 w-2.5 rounded-full mr-2 ${isOnline ? 'bg-white' : 'bg-gray-200'} ${isOnline ? 'animate-pulse' : ''}`}></span>
              {isOnline ? "Online" : "Offline"}
            </motion.button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <span 
                className="text-gray-300 text-2xl cursor-pointer hover:text-orange-400 p-1"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                👤
              </span>
              
              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-2xl overflow-hidden ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <button 
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white transition duration-150"
                    >
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};


// --- CARD COMPONENTS ---

const StatCard = ({ label, value, icon }: (typeof MOCK_STATS)[0]) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.3 }}
    className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border border-gray-100"
  >
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
    <div className="text-sm font-medium text-gray-500 mt-1">{label}</div>
  </motion.div>
);

const OrderCard = ({ id, restaurant, pickupLocation, distance, onAccept }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="flex justify-between items-center p-4 bg-white rounded-xl shadow-md border border-gray-200 mb-3 hover:shadow-lg transition duration-200"
  >
    <div>
      <div className="text-lg font-semibold text-gray-900">Order #{id}</div>
      <div className="text-sm text-orange-600 font-medium">{restaurant}</div>
      <div className="text-xs text-gray-500 mt-1">
        Pickup: {pickupLocation} ({distance} away)
      </div>
    </div>
    <button
      onClick={() => onAccept(id)}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md transition duration-150 transform hover:scale-105"
    >
      Accept
    </button>
  </motion.div>
);

const CurrentDeliveryCard = ({ delivery }: { delivery: typeof MOCK_CURRENT_DELIVERY }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-orange-50 border-2 border-orange-200 p-6 rounded-2xl shadow-xl space-y-3"
  >
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold text-orange-700">CURRENT DELIVERY</h2>
      <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full animate-pulse">
        {delivery.status}
      </span>
    </div>

    <div className="text-sm text-gray-600">
      <p>
        <span className="font-semibold">Order:</span> #{delivery.id}
      </p>
      <p>
        <span className="font-semibold">Customer:</span> {delivery.customer}
      </p>
    </div>

    <div className="space-y-2 pt-2 border-t border-orange-100">
      <div className="flex items-center text-gray-800">
        <span className="text-xl mr-3">🏠</span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500">PICKUP: {delivery.restaurant}</span>
          <span className="text-sm font-medium">{delivery.pickupAddress}</span>
        </div>
      </div>
      <div className="flex items-center text-gray-800">
        <span className="text-xl mr-3">📍</span>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-gray-500">DELIVER TO:</span>
          <span className="text-sm font-medium">{delivery.deliveryAddress}</span>
        </div>
      </div>
    </div>

    <div className="mt-4 pt-3 border-t border-orange-100 flex justify-between items-center">
      <div className="text-2xl font-extrabold text-orange-600">ETA: {delivery.eta}</div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition">
        View Route
      </button>
    </div>
  </motion.div>
);

// --- MAIN PAGE COMPONENT ---
export default function DriverDashboard() {
  const [currentOrders, setCurrentOrders] = useState(MOCK_ORDERS);

  const handleAcceptOrder = (id: number) => {
    // In a real app, this would update the order status in the database
    setCurrentOrders(currentOrders.filter((order) => order.id !== id));
    // Simulate setting the new delivery
    console.log(`Order ${id} accepted!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto p-4 sm:p-8" // Added padding to the main content
      >
        <header className="mb-10 pt-4"> 
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome Back, Driver!
          </h1>
          <p className="text-lg text-gray-600">
            Manage your deliveries and view your daily stats.
          </p>
        </header>

        {/* STATS GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {MOCK_STATS.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CURRENT DELIVERY CARD (LHS) */}
          <section className="lg:col-span-1">
            <CurrentDeliveryCard delivery={MOCK_CURRENT_DELIVERY} />
          </section>

          {/* NEW ORDERS LIST (RHS) */}
          <section className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              New Orders Available ({currentOrders.length})
              <span className="ml-3 inline-block h-3 w-3 bg-green-500 rounded-full animate-ping"></span>
            </h2>

            <div className="space-y-4">
              {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                  <OrderCard
                    key={order.id}
                    {...order}
                    onAccept={handleAcceptOrder}
                  />
                ))
              ) : (
                <div className="p-8 bg-white rounded-xl text-center text-gray-500 border-dashed border-2 border-gray-300">
                  <p className="text-lg font-medium">
                    🎉 All caught up! No new orders right now.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}