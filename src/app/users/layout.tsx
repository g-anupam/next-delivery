"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserCircle2 } from "lucide-react";
import { CartProvider } from "@/lib/CartContext";
import CartNavLink from "@/components/CartNavLink";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <CartProvider>
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
        <Link
          href="/users/restaurants"
          className="text-2xl font-extrabold text-orange-600 tracking-tight hover:text-orange-700 transition"
        >
          QuickBite
        </Link>

        <div className="hidden sm:flex space-x-8">
          <Link
            href="/users/restaurants"
            className={`font-medium ${
              pathname.startsWith("/users/restaurants")
                ? "text-orange-600"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Restaurants
          </Link>
          <Link
            href="/users/orders"
            className={`font-medium ${
              pathname.startsWith("/users/orders")
                ? "text-orange-600"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            My Orders
          </Link>
        </div>

        <div className="flex items-center space-x-6">
          <CartNavLink />
          <button
            className="p-2 rounded-full hover:bg-orange-100 transition"
            aria-label="User Profile"
          >
            <UserCircle2 className="h-7 w-7 text-gray-700 hover:text-orange-600" />
          </button>
        </div>
      </nav>

      {/* Page background — solid soft orange */}
      <main className="min-h-screen bg-orange-50">{children}</main>
    </CartProvider>
  );
}
