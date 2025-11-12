"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { UserCircle2, LogOut } from "lucide-react";
import { CartProvider } from "@/lib/CartContext";
import CartNavLink from "@/components/CartNavLink";

export default function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

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

        {/* Right Section */}
        <div className="relative flex items-center space-x-6">
          <CartNavLink />

          {/* Profile Icon */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-full hover:bg-orange-100 transition relative"
            aria-label="User Profile"
          >
            <UserCircle2 className="h-7 w-7 text-gray-700 hover:text-orange-600" />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-12 bg-white shadow-lg border border-orange-100 rounded-xl py-2 w-40">
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition text-left"
              >
                <LogOut className="h-4 w-4 mr-2" /> Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Background */}
      <main className="min-h-screen bg-orange-50">{children}</main>
    </CartProvider>
  );
}
