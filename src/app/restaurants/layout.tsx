"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-orange-50">
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-orange-100 shadow-sm sticky top-0 z-50">
        {/* Left: Logo */}
        <Link
          href="/restaurants"
          className="text-2xl font-extrabold text-orange-600 tracking-tight hover:text-orange-700 transition"
        >
          QuickBite Partner
        </Link>

        {/* Middle: Navigation */}
        <div className="hidden sm:flex space-x-8">
          <Link
            href="/restaurants"
            className={`font-medium ${
              pathname === "/restaurants"
                ? "text-orange-600"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Dashboard
          </Link>

          <Link
            href="/restaurants/menu"
            className={`font-medium ${
              pathname.startsWith("/restaurants/menu")
                ? "text-orange-600"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Menu
          </Link>

          <Link
            href="/restaurants/orders"
            className={`font-medium ${
              pathname.startsWith("/restaurants/orders")
                ? "text-orange-600"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Orders
          </Link>

          <Link
            href="/restaurants/profile"
            className={`font-medium ${
              pathname.startsWith("/restaurants/profile")
                ? "text-orange-600"
                : "text-gray-700 hover:text-orange-600"
            }`}
          >
            Profile
          </Link>
        </div>

        {/* Right: Logout placeholder */}
        <button className="p-2 rounded-xl text-gray-700 hover:text-orange-600 transition">
          <LogOut className="h-6 w-6" />
        </button>
      </nav>

      {/* Page content */}
      <main className="p-8">{children}</main>
    </div>
  );
}
