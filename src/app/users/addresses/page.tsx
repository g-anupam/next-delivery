"use client";

import { useState, useEffect } from "react";

type Address = {
  Address_ID: number;
  Address_First_Line: string;
  Address_Second_Line: string | null;
  City: string;
  Pincode: string;
};

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);

  const [form, setForm] = useState({
    address1: "",
    address2: "",
    city: "",
    pincode: "",
  });

  const fetchAddresses = async () => {
    const res = await fetch("/api/user/addresses");
    const data = await res.json();
    setAddresses(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/user/addresses", {
      method: "POST",
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setShowAdd(false);
      setForm({ address1: "", address2: "", city: "", pincode: "" });
      fetchAddresses();
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading addresses...
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Saved Addresses</h1>

        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
        >
          Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <p className="text-gray-600">No saved addresses yet.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((a) => (
            <div
              key={a.Address_ID}
              className="border bg-white rounded-lg p-4 shadow-sm"
            >
              {/* Primary Address Line - remains bold */}
              <p className="font-semibold text-gray-900">{a.Address_First_Line}</p>
              
              {/* Secondary Address Line - added dark text */}
              {a.Address_Second_Line && <p className="text-gray-700">{a.Address_Second_Line}</p>}
              
              {/* City and Pincode - added dark text */}
              <p className="text-gray-700">
                {a.City} - {a.Pincode}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ADD NEW ADDRESS MODAL */}
      {showAdd && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-20">
          <form
            onSubmit={handleAdd}
            className="bg-white p-6 rounded-xl w-full max-w-md space-y-4 shadow-xl"
          >
            <h2 className="text-xl font-bold text-gray-900">Add New Address</h2>

            <input
              className="w-full border p-2 rounded text-gray-900 placeholder-gray-600 font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              placeholder="Address Line 1"
              required
              value={form.address1}
              onChange={(e) => setForm({ ...form, address1: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded text-gray-900 placeholder-gray-600 font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              placeholder="Address Line 2 (optional)"
              value={form.address2}
              onChange={(e) => setForm({ ...form, address2: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded text-gray-900 placeholder-gray-600 font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              placeholder="City"
              required
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <input
              className="w-full border p-2 rounded text-gray-900 placeholder-gray-600 font-medium focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition"
              placeholder="Pincode"
              required
              value={form.pincode}
              onChange={(e) => setForm({ ...form, pincode: e.target.value })}
            />

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="px-4 py-2 border border-gray-400 text-gray-700 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}