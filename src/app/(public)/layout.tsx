// src/app/(public)/layout.tsx

"use client";

import Link from "next/link";
import { CartProvider } from "@/lib/CartContext";
import CartNavLink from "@/components/CartNavLink";
import RestaurantConflictDialog from "@/components/RestaurantConflictDialog";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      {/* Public Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-white shadow-sm">
        <Link
          href="/"
          className="text-2xl font-extrabold text-orange-600 tracking-tight hover:text-orange-700 transition"
        >
          QuickBite
        </Link>

        <div className="flex items-center space-x-4">
          <div className="space-x-6 hidden sm:flex">
            <Link
              href="/users/restaurants"
              className="text-gray-700 hover:text-orange-600 transition"
            >
              Restaurants
            </Link>
            <Link
              href="#"
              className="text-gray-700 hover:text-orange-600 transition"
            >
              Drivers
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-orange-600 transition"
            >
              About
            </Link>
          </div>

          <CartNavLink />

          <Link
            href="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl shadow-md transition"
          >
            Login / Signup
          </Link>
        </div>
      </nav>

      {/* Public page content */}
      <main>{children}</main>

      {/* Restaurant conflict dialog */}
      <RestaurantConflictDialog />
    </CartProvider>
  );
}
