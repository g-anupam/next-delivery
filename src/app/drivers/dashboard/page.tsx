"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

// NAVBAR COMPONENT -----------------------------------------------------

const DriverNavbar = () => {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const toggleOnlineStatus = () => setIsOnline(!isOnline);

  const handleSignOut = async () => {
    setIsProfileMenuOpen(false);

    try {
      await fetch("/api/logout", { method: "POST" });
    } catch (_) {}

    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-10 bg-gray-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/drivers/dashboard"
            className="text-2xl font-extrabold text-orange-500 tracking-wider"
          >
            QuickBite Driver
          </Link>

          {/* Nav links */}
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

          {/* Online toggle + profile */}
          <div className="flex items-center space-x-4">
            <motion.button
              onClick={toggleOnlineStatus}
              className={`flex items-center text-sm font-bold py-2 px-4 rounded-full ${
                isOnline
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full mr-2 ${
                  isOnline ? "bg-white" : "bg-gray-200"
                } ${isOnline ? "animate-pulse" : ""}`}
              ></span>
              {isOnline ? "Online" : "Offline"}
            </motion.button>

            {/* Profile Menu */}
            <div className="relative">
              <span
                className="text-gray-300 text-xl cursor-pointer hover:text-orange-400 p-1"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                Profile
              </span>

              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-3 w-48 bg-white rounded-lg shadow-2xl"
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

// COMPONENTS -----------------------------------------------------------

const OrderCard = ({
  id,
  restaurant,
  restaurantAddress1,
  restaurantAddress2,
  restaurantCity,
  restaurantPincode,
  deliveryAddress1,
  deliveryAddress2,
  deliveryCity,
  deliveryPincode,
  onAccept,
}: any) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="p-4 bg-white rounded-xl shadow-md border mb-3 hover:shadow-lg"
  >
    <div className="flex justify-between items-start">
      <div>
        <div className="text-lg font-semibold text-gray-900">Order #{id}</div>
        <div className="text-sm text-orange-600 font-medium">{restaurant}</div>

        <div className="text-xs text-gray-500 mt-2">
          <span className="font-semibold">Pickup:</span>
          <div>{restaurantAddress1}</div>
          {restaurantAddress2 && <div>{restaurantAddress2}</div>}
          <div>
            {restaurantCity} - {restaurantPincode}
          </div>
        </div>

        <div className="text-xs text-gray-500 mt-2">
          <span className="font-semibold">Delivery:</span>
          <div>{deliveryAddress1}</div>
          {deliveryAddress2 && <div>{deliveryAddress2}</div>}
          <div>
            {deliveryCity} - {deliveryPincode}
          </div>
        </div>
      </div>

      <button
        onClick={onAccept}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full text-sm shadow-md"
      >
        Accept
      </button>
    </div>
  </motion.div>
);

const CurrentDeliveryCard = ({ delivery }: any) => {
  if (!delivery) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-orange-50 border p-6 rounded-2xl shadow-lg"
    >
      <h2 className="text-lg font-bold text-orange-700 mb-2">
        Current Delivery
      </h2>

      <div className="text-sm text-gray-700">
        <div>
          <span className="font-semibold">Order:</span> #{delivery.Order_ID}
        </div>
        <div>
          <span className="font-semibold">Restaurant:</span>{" "}
          {delivery.Restaurant_Name}
        </div>
        <div className="mt-2">
          <span className="font-semibold">Delivery Address:</span>
          <div>{delivery.Address_First_Line}</div>
          {delivery.Address_Second_Line && (
            <div>{delivery.Address_Second_Line}</div>
          )}
          <div>
            {delivery.City} - {delivery.Pincode}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// MAIN PAGE ------------------------------------------------------------

export default function DriverDashboard() {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [currentDelivery, setCurrentDelivery] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/driver/available-orders");
        const data = await res.json();
        if (Array.isArray(data)) setAvailableOrders(data);
      } catch (_) {}
    }
    load();
  }, []);

  const handleAccept = async (orderId: number) => {
    try {
      const res = await fetch("/api/driver/accept-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.error);

      // Move order into current delivery
      const acceptedOrder = availableOrders.find((o) => o.Order_ID === orderId);
      setCurrentDelivery(acceptedOrder);

      // Remove from available list
      setAvailableOrders((prev) => prev.filter((o) => o.Order_ID !== orderId));
    } catch (_) {}
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DriverNavbar />

      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">
          Welcome Back
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            {/* If driver currently has a delivery => show live card */}
            {currentDelivery ? (
              <CurrentDeliveryCard delivery={currentDelivery} />
            ) : (
              /* Else, show the old 3-card stats grid */
              <section className="grid grid-cols-1 gap-6 mb-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border"
                >
                  <div className="text-3xl font-bold text-gray-900">12</div>
                  <div className="text-sm font-medium text-gray-500">
                    Deliveries Today
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border"
                >
                  <div className="text-3xl font-bold text-gray-900">
                    $185.50
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    Total Earnings
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center p-6 bg-white rounded-xl shadow-lg border"
                >
                  <div className="text-3xl font-bold text-gray-900">22 min</div>
                  <div className="text-sm font-medium text-gray-500">
                    Avg Delivery Time
                  </div>
                </motion.div>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              New Orders Available ({availableOrders.length})
            </h2>

            {availableOrders.length === 0 ? (
              <div className="p-8 bg-white rounded-xl text-center text-gray-500 border-dashed border-2 border-gray-300">
                No new orders right now.
              </div>
            ) : (
              availableOrders.map((order) => (
                <OrderCard
                  key={order.Order_ID}
                  id={order.Order_ID}
                  restaurant={order.Restaurant_Name}
                  restaurantAddress1={order.Restaurant_Address_First_Line}
                  restaurantAddress2={order.Restaurant_Address_Second_Line}
                  restaurantCity={order.Restaurant_City}
                  restaurantPincode={order.Restaurant_Pincode}
                  deliveryAddress1={order.Address_First_Line}
                  deliveryAddress2={order.Address_Second_Line}
                  deliveryCity={order.City}
                  deliveryPincode={order.Pincode}
                  onAccept={() => handleAccept(order.Order_ID)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
