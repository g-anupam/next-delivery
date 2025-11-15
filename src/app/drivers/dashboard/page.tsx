"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// ----------------------
// NAVBAR COMPONENT
// ----------------------
const DriverNavbar = () => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleOnlineStatus = () => setIsOnline(!isOnline);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);
    await fetch("/api/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-10 bg-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/drivers/dashboard"
            className="text-2xl font-extrabold text-orange-500 tracking-wider"
          >
            QuickBite Driver
          </Link>

          <div className="flex space-x-6">
            <Link
              href="/drivers/dashboard"
              className="text-white hover:text-orange-400 px-3 py-2 text-sm font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/drivers/history"
              className="text-gray-300 hover:text-orange-400 px-3 py-2 text-sm font-medium"
            >
              Earnings History
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleOnlineStatus}
              className={`flex items-center text-sm font-bold py-2 px-4 rounded-full ${
                isOnline ? "bg-green-600" : "bg-red-600"
              } text-white shadow-md`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full mr-2 ${
                  isOnline ? "bg-white animate-pulse" : "bg-gray-200"
                }`}
              ></span>
              {isOnline ? "Online" : "Offline"}
            </motion.button>

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
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-2xl overflow-hidden"
                >
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
                  >
                    Sign Out
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// ----------------------
// CARD COMPONENTS
// ----------------------
const StatCard = ({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) => (
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

const OrderCard = ({
  id,
  restaurant,
  pickupLocation,
  onAccept,
}: {
  id: number;
  restaurant: string;
  pickupLocation: string;
  onAccept: (id: number) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: 0.1 }}
    className="flex justify-between items-center p-4 bg-white rounded-xl shadow-md border border-gray-200 mb-3 hover:shadow-lg"
  >
    <div>
      <div className="text-lg font-semibold text-gray-900">Order #{id}</div>
      <div className="text-sm text-orange-600 font-medium">{restaurant}</div>
      <div className="text-xs text-gray-500 mt-1">Pickup: {pickupLocation}</div>
    </div>
    <button
      onClick={() => onAccept(id)}
      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md"
    >
      Accept
    </button>
  </motion.div>
);

// ----------------------
// MAIN PAGE
// ----------------------
export default function DriverDashboard() {
  const [newOrders, setNewOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Fetch available orders for driver
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/driver/available-orders");
        const data = await res.json();
        if (Array.isArray(data)) setNewOrders(data);
      } catch (err) {
        console.error("Failed to load driver orders", err);
      } finally {
        setLoadingOrders(false);
      }
    })();
  }, []);

  const handleAcceptOrder = async (orderId: number) => {
    try {
      const res = await fetch(`/api/driver/orders/${orderId}/accept`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to accept order");

      // Remove from list
      setNewOrders((prev) => prev.filter((o) => o.Order_ID !== orderId));
    } catch (err) {
      console.error("Accept order error:", err);
      alert("Failed to accept the order.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto p-4 sm:p-8"
      >
        {/* Header */}
        <header className="mb-10 pt-4">
          <h1 className="text-4xl font-extrabold text-gray-900">
            Welcome Back, Driver!
          </h1>
          <p className="text-lg text-gray-600">
            Manage your deliveries and view your daily stats.
          </p>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          <StatCard label="Deliveries Today" value={12} icon="📦" />
          <StatCard label="Total Earnings" value="₹1850" icon="💰" />
          <StatCard label="Avg Delivery Time" value="22 min" icon="⏱️" />
        </section>

        {/* Orders Section */}
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            New Orders Available ({newOrders.length})
            <span className="ml-3 inline-block h-3 w-3 bg-green-500 rounded-full animate-ping"></span>
          </h2>

          {loadingOrders ? (
            <div className="p-8 bg-white rounded-xl text-center text-gray-500">
              Loading orders...
            </div>
          ) : newOrders.length > 0 ? (
            newOrders.map((order) => (
              <OrderCard
                key={order.Order_ID}
                id={order.Order_ID}
                restaurant={order.Restaurant_Name}
                pickupLocation={`${order.Address_First_line || ""} ${
                  order.Address_Second_line || ""
                }`}
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
        </section>
      </motion.div>
    </div>
  );
}
