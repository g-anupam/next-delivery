// src/app/users/checkout/page.tsx
"use client";

import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function CheckoutPage() {
  const { cart, getTotalPrice, clearCart, decrementQuantity, addToCart } =
    useCart();
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return alert("Your cart is empty.");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      alert("Order placed successfully!");
      clearCart();
      router.push("/users/restaurants");
    } catch (err: any) {
      console.error("Error placing order:", err.message);
      alert("Something went wrong placing your order.");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

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
                  key={item.id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        decrementQuantity(item.id, item.restaurantId)
                      }
                      className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      -
                    </button>
                    <span className="text-lg font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => addToCart(item)}
                      className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300"
                    >
                      +
                    </button>
                    <button
                      onClick={() =>
                        decrementQuantity(item.id, item.restaurantId, true)
                      }
                      className="ml-4 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 border-t pt-6 flex justify-between items-center">
              <p className="text-xl font-semibold text-gray-800">
                Total: ₹{getTotalPrice().toFixed(2)}
              </p>
              <button
                onClick={handlePlaceOrder}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Place Order
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
