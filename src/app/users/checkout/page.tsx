// src/app/users/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Address = {
  Address_ID: number;
  Address_First_Line: string;
  Address_Second_Line?: string | null;
  City: string;
  Pincode: string;
};

export default function CheckoutPage() {
  const { cart, getTotalPrice } = useCart();
  const router = useRouter();

<<<<<<< HEAD
  const handlePlaceOrder = async () => {
    // FIX: Replaced alert() with console.error and a visible prompt for now
    if (cart.length === 0) {
      console.error("Attempted to place an empty order.");
      // In a real app, you would show a modal here.
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
      
      // Navigate the user to a confirmation page or the restaurant list
      router.push("/users/restaurants");
    } catch (err: any) {
      console.error("Error placing order:", err.message);
      // FIX: Replaced alert()
      console.error("Something went wrong placing your order.");
=======
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
        console.error(err);
      } finally {
        setLoading(false);
      }
>>>>>>> dd0db27 (feat: order payment created)
    }
    loadAddresses();
  }, []);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-gray-600">Your cart is empty.</p>
          <Link
            href="/users/restaurants"
            className="text-orange-600 hover:underline"
          >
            Browse restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Checkout</h2>

<<<<<<< HEAD
        {cart.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">
            Your cart is empty.{" "}
            <a
              href="/users/restaurants"
              className="text-orange-600 hover:underline"
            >
              Browse restaurants
            </a>
          </p>
        ) : (
          <>
            <ul className="space-y-6">
              {cart.map((item) => (
                <li
                  key={`${item.id}-${item.restaurantId}`} // Use composite key for safety
                  className="flex justify-between items-center border-b pb-3"
                >
=======
        <div className="grid md:grid-cols-2 gap-6">
          {/* Cart Summary */}
          <div>
            <h3 className="font-semibold mb-2">Your items</h3>
            <ul className="space-y-3">
              {cart.map((it) => (
                <li key={it.id} className="flex justify-between">
>>>>>>> dd0db27 (feat: order payment created)
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-sm text-gray-500">
                      Qty: {it.quantity}
                    </div>
                  </div>
<<<<<<< HEAD
                  <div className="flex items-center space-x-2">
                    {/* ⭐️ FIX: Decrement Button Styling ⭐️ */}
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
                    {/* ⭐️ FIX: Increment Button Styling ⭐️ */}
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-bold"
                    >
                      +
                    </button>
                    <button
                      // Note: Assuming decrementQuantity is used to remove the item entirely if a third argument 'true' is not supported by your context
                      onClick={() =>
                        // This calls the context function to fully remove the item
                        // We will use a safe combination: decrementing until 0, or just calling remove if item ID is not unique.
                        decrementQuantity(item.id, item.restaurantId)
                      }
                      className="ml-4 text-red-500 hover:text-red-700 p-1"
                      title="Remove Item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
=======
                  <div className="font-semibold">
                    ₹{(it.price * it.quantity).toFixed(2)}
>>>>>>> dd0db27 (feat: order payment created)
                  </div>
                </li>
              ))}
            </ul>
<<<<<<< HEAD

            <div className="mt-8 border-t pt-6 flex justify-between items-center">
              <p className="text-xl font-semibold text-gray-800">
                Total: ₹{getTotalPrice().toFixed(2)}
              </p>
              <button
                onClick={handlePlaceOrder}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
              >
                Place Order
              </button>
=======
            <div className="mt-4 flex justify-between font-bold">
              <div>Total</div>
              <div>₹{getTotalPrice().toFixed(2)}</div>
>>>>>>> dd0db27 (feat: order payment created)
            </div>
          </div>

          {/* Address selector */}
          <div>
            <h3 className="font-semibold mb-2">Select delivery address</h3>
            {loading ? (
              <div>Loading addresses...</div>
            ) : addresses.length === 0 ? (
              <div>
                <p className="text-gray-600">
                  No saved addresses. Add one from your profile.
                </p>
                <Link
                  href="/users/addresses"
                  className="text-orange-600 hover:underline"
                >
                  Add address
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((a) => (
                  <label
                    key={a.Address_ID}
                    className={`block p-3 rounded border ${selectedAddress === a.Address_ID ? "border-orange-400 bg-orange-50" : "border-gray-200"}`}
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
                      <div className="text-sm">{a.Address_Second_Line}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      {a.City} - {a.Pincode}
                    </div>
                  </label>
                ))}
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                disabled={!selectedAddress}
                onClick={() =>
                  router.push(`/users/payment?addressId=${selectedAddress}`)
                }
                className={`px-4 py-2 rounded bg-orange-500 text-white ${!selectedAddress ? "opacity-60 cursor-not-allowed" : "hover:bg-orange-600"}`}
              >
                Proceed to payment
              </button>

              <Link
                href="/users/addresses"
                className="px-4 py-2 rounded border"
              >
                Manage addresses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
