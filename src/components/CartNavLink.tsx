// src/components/CartNavLink.tsx
"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react"; // Remember to run: npm install lucide-react
import { useCart } from "@/lib/CartContext";

export default function CartNavLink() {
  const { getTotalItems } = useCart();
  const itemCount = getTotalItems();

  return (
    <Link
      href="/users/checkout"
      className="relative p-2 rounded-full text-gray-700 hover:text-orange-600 hover:bg-gray-100 transition"
      aria-label={`View shopping cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
