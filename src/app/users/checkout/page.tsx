// src/app/users/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";

type Address = {
  Address_ID: number;
  Address_First_Line: string;
  Address_Second_Line?: string | null;
  City: string;
  Pincode: string;
};

export default function CheckoutPage() {
  const { cart, getTotalPrice, addToCart, decrementQuantity, clearCart } =
    useCart();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<number | null>(null);

  useEffect(() => {
    async function loadAddresses() {
      try {
        const res = await fetch("/api/user/addresses");
        const data = await res.json();
        if (Array.isArray(data)) setAddresses(data);
      } catch (err) {
        console.error("Failed to load addresses", err);
      } finally {
        setLoading(false);
      }
    }
    loadAddresses();
  }, []);

  const handlePlaceOrder = async () => {
    if (cart.length === 0) {
      console.error("Attempted to place an empty order.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      console.log("Order placed successfully!", data);
      clearCart();
      router.push("/users/restaurants");
    } catch (err: any) {
      console.error("Error placing order:", err.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-black">Your cart is empty.</p>
          <Link href="/users/restaurants" className="text-orange-600 underline">
            Browse restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-6 text-black">Checkout</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Cart Items */}
          <div>
            <h3 className="font-semibold mb-2 text-black">Your Items</h3>
            <ul className="space-y-3">
              {cart.map((item) => (
                <li
                  key={`${item.id}-${item.restaurantId}`}
                  className="flex justify-between items-center border-b pb-3 text-black"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    {/* changed to black */}
                    <div className="text-sm text-gray-600">
                      Qty: {item.quantity}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        decrementQuantity(item.id, item.restaurantId)
                      }
                      className="px-3 py-1 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition font-bold"
                    >
                      -
                    </button>

                    <span className="text-lg font-semibold text-gray-900">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
                    >
                      +
                    </button>

                    <button
                      onClick={() =>
                        decrementQuantity(item.id, item.restaurantId)
                      }
                      className="text-red-500 hover:text-red-700 p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="font-semibold">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex justify-between font-bold text-lg text-black">
              <span>Total</span>
              <span>₹{getTotalPrice().toFixed(2)}</span>
            </div>
          </div>

          {/* Right: Address Selector */}
          <div>
            <h3 className="font-semibold mb-2 text-black">
              Select Delivery Address
            </h3>

            {loading ? (
              <div>Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div>
                <p className="text-black">
                  No saved addresses. Add one from your profile.
                </p>
                <Link
                  href="/users/addresses"
                  className="text-orange-600 underline"
                >
                  Add Address
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a.Address_ID}
                    className={`block p-3 rounded border text-black ${
                      selectedAddress === a.Address_ID
                        ? "border-orange-400 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={a.Address_ID}
                      checked={selectedAddress === a.Address_ID}
                      onChange={() => setSelectedAddress(a.Address_ID)}
                      className="mr-2"
                    />

                    <div className="font-medium">{a.Address_First_Line}</div>

                    {a.Address_Second_Line && (
                      <div className="text-sm text-black">
                        {a.Address_Second_Line}
                      </div>
                    )}

                    <div className="text-sm text-black">
                      {a.City} - {a.Pincode}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <button
              disabled={!selectedAddress}
              onClick={() =>
                router.push(`/users/payment?addressId=${selectedAddress}`)
              }
              className={`mt-6 px-4 py-2 rounded bg-orange-500 text-white ${
                !selectedAddress
                  ? "opacity-60 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
