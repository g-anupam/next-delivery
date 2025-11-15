"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/CartContext";

type Address = {
  Address_ID: number;
  Address_First_Line: string;
  Address_Second_Line: string | null;
  City: string;
  Pincode: string;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const subtotal = getTotalPrice();
  const deliveryFee = 30;
  const finalAmount = subtotal + deliveryFee;

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await fetch("/api/user/addresses");
        if (!res.ok) {
          throw new Error("Failed to fetch addresses");
        }
        const data = await res.json();
        if (Array.isArray(data)) {
          setAddresses(data);
          if (data.length > 0) {
            setSelectedAddressId(data[0].Address_ID);
          }
        }
      } catch (err) {
        console.error("Error loading addresses:", err);
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, []);

  const handleContinue = () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }

    router.push(`/users/payment?addressId=${selectedAddressId}`);
  };

  const formatAmount = (value: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(value);

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 md:p-8">
        <h2 className="text-2xl font-bold text-black mb-4">Checkout</h2>

        {/* Cart summary (simple) */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-2">Order Summary</h3>
          {cart.length === 0 ? (
            <p className="text-gray-600 text-sm">
              Your cart is empty. Add some items to continue.
            </p>
          ) : (
            <ul className="space-y-1 text-sm text-gray-800">
              {cart.map((item) => (
                <li
                  key={`${item.id}-${item.restaurantId}`}
                  className="flex justify-between"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    {formatAmount(Number(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Address selection */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-2">Delivery Address</h3>

          {loadingAddresses ? (
            <p className="text-gray-600 text-sm">Loading addresses...</p>
          ) : addresses.length === 0 ? (
            <p className="text-gray-600 text-sm">
              You have no saved addresses. Please add one in your profile.
            </p>
          ) : (
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.Address_ID}
                  className="flex items-start space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-orange-50"
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.Address_ID}
                    checked={selectedAddressId === addr.Address_ID}
                    onChange={() => setSelectedAddressId(addr.Address_ID)}
                    className="mt-1"
                  />
                  <div className="text-sm text-gray-800">
                    <div>{addr.Address_First_Line}</div>
                    {addr.Address_Second_Line && (
                      <div>{addr.Address_Second_Line}</div>
                    )}
                    <div>
                      {addr.City} - {addr.Pincode}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Billing section with delivery fee */}
        <div className="mb-6">
          <h3 className="font-semibold text-black mb-2">Bill Details</h3>
          <div className="space-y-1 text-gray-800 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatAmount(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatAmount(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-semibold border-t pt-2 mt-2">
              <span>Total</span>
              <span>{formatAmount(finalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Continue button */}
        <div className="flex justify-end">
          <button
            onClick={handleContinue}
            disabled={cart.length === 0 || !selectedAddressId}
            className={`px-4 py-2 rounded text-white font-semibold ${
              cart.length === 0 || !selectedAddressId
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            Continue to Payment
          </button>
        </div>
      </div>
    </div>
  );
}
