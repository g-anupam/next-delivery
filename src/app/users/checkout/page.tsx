// src/app/users/checkout/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/lib/CartContext";
import { useRouter } from "next/navigation";

type Address = {
  Address_ID: number;
  Address_First_Line: string;
  Address_Second_Line: string | null;
  City: string;
  Pincode: string;
};

type Coupon = {
  Coupon_ID: number;
  Discount: string | number;
  Expiry: string | null;
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalPrice } = useCart();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(
    null,
  );

  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [selectedCouponId, setSelectedCouponId] = useState<number | null>(null);

  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loadingCoupons, setLoadingCoupons] = useState(false);
  const [error, setError] = useState("");

  // Compute subtotal from cart
  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice]);

  // For now, keep flat fees as before (you can adjust)
  const deliveryFee = cart.length > 0 ? 30 : 0;
  const platformFee = cart.length > 0 ? 10 : 0;

  const selectedCoupon = useMemo(
    () => coupons.find((c) => c.Coupon_ID === selectedCouponId),
    [coupons, selectedCouponId],
  );

  const couponDiscount = useMemo(() => {
    if (!selectedCoupon) return 0;
    const rate = Number(selectedCoupon.Discount) || 0;
    if (rate <= 0) return 0;
    return (subtotal * rate) / 100;
  }, [subtotal, selectedCoupon]);

  const payableTotal = useMemo(() => {
    const afterDiscount = Math.max(subtotal - couponDiscount, 0);
    return afterDiscount + deliveryFee + platformFee;
  }, [subtotal, couponDiscount, deliveryFee, platformFee]);

  const restaurantId =
    cart.length > 0
      ? Number(cart[0].restaurantId ?? cart[0].restaurantId)
      : null;

  // Load addresses
  useEffect(() => {
    async function loadAddresses() {
      setLoadingAddresses(true);
      setError("");
      try {
        const res = await fetch("/api/user/addresses");
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch addresses");
        }
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].Address_ID);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch addresses error:", err);
        setError(msg);
      } finally {
        setLoadingAddresses(false);
      }
    }

    loadAddresses();
  }, []);

  // Load coupons for restaurant
  useEffect(() => {
    if (!restaurantId) {
      setCoupons([]);
      setSelectedCouponId(null);
      return;
    }

    async function loadCoupons() {
      setLoadingCoupons(true);
      setError("");
      try {
        const res = await fetch(`/api/restaurants/${restaurantId}/coupons`);
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch coupons");
        }
        setCoupons(data);
        // Do not auto-select any coupon
        setSelectedCouponId(null);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        console.error("Fetch coupons error:", err);
        setError(msg);
      } finally {
        setLoadingCoupons(false);
      }
    }

    loadCoupons();
  }, [restaurantId]);

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      alert("Please select a delivery address.");
      return;
    }
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const couponPart =
      selectedCouponId != null ? `&couponId=${selectedCouponId}` : "";
    router.push(
      `/users/payment?addressId=${selectedAddressId}${couponPart}&total=${payableTotal.toFixed(2)}`,
    );
  };

  return (
    <div className="min-h-screen bg-orange-50 py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Cart + addresses */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cart Items */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-black">
              Your Cart ({cart.length} items)
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-600">Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <li
                    key={`${item.id}-${item.restaurantId}`}
                    className="py-3 flex justify-between text-gray-800"
                  >
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-4 text-black">
              Delivery Address
            </h2>

            {loadingAddresses ? (
              <p className="text-gray-600">Loading addresses...</p>
            ) : addresses.length === 0 ? (
              <p className="text-gray-600">
                You have no saved addresses. Please add one in your profile.
              </p>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.Address_ID}
                    className={`block border rounded-xl px-4 py-3 cursor-pointer ${
                      selectedAddressId === addr.Address_ID
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200 hover:border-orange-300"
                    }`}
                  >
                    <div className="flex items-start space-x-3">
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
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary + Coupons + Proceed */}
        <div className="space-y-6">
          {/* Coupons */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-3 text-black">
              Available Coupons
            </h2>
            {loadingCoupons ? (
              <p className="text-gray-600">Loading coupons...</p>
            ) : !restaurantId ? (
              <p className="text-gray-600">
                Add items from a restaurant to see coupons.
              </p>
            ) : coupons.length === 0 ? (
              <p className="text-gray-600">No coupons available.</p>
            ) : (
              <div className="space-y-2">
                {coupons.map((c) => {
                  const isSelected = selectedCouponId === c.Coupon_ID;
                  return (
                    <button
                      key={c.Coupon_ID}
                      type="button"
                      onClick={() =>
                        setSelectedCouponId(isSelected ? null : c.Coupon_ID)
                      }
                      className={`w-full text-left border rounded-lg px-3 py-2 text-sm ${
                        isSelected
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:border-orange-300"
                      }`}
                    >
                      <div className="font-semibold text-gray-900">
                        {Number(c.Discount).toFixed(2)}% off
                      </div>
                      <div className="text-xs text-gray-600">
                        {c.Expiry
                          ? `Valid till ${new Date(
                              c.Expiry,
                            ).toLocaleDateString()}`
                          : "No expiry"}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-4 text-black">Price Details</h2>

            <div className="space-y-2 text-sm text-gray-800">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-green-700">
                  <span>Coupon discount</span>
                  <span>-₹{couponDiscount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Delivery fee</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform fee</span>
                <span>₹{platformFee.toFixed(2)}</span>
              </div>

              <hr className="my-2" />

              <div className="flex justify-between font-bold text-base text-black">
                <span>Total payable</span>
                <span>₹{payableTotal.toFixed(2)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleProceedToPayment}
              disabled={cart.length === 0 || !selectedAddressId}
              className={`mt-4 w-full py-2 rounded-lg text-white font-semibold ${
                cart.length === 0 || !selectedAddressId
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              Proceed to payment
            </button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
