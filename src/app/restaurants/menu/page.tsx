"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type MenuItem = {
  Menu_ID: number;
  Item_Name: string;
  Item_Description: string;
  Price: number;
};

export default function RestaurantMenuPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [editing, setEditing] = useState<MenuItem | null>(null);

  async function fetchMenu() {
    setLoading(true);
    try {
      const res = await fetch("/api/restaurant/menu");
      const data = await res.json();

      console.log("Fetched menu data:", data); // 👈 Add this line

      if (Array.isArray(data)) {
        setMenu(data);
      } else {
        console.error("Unexpected API response:", data);
        setMenu([]); // prevent map error
      }
    } catch (err) {
      console.error("Error fetching menu:", err);
      setMenu([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMenu();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const endpoint = editing
      ? `/api/restaurant/menu/${editing.Menu_ID}`
      : "/api/restaurant/menu";
    const method = editing ? "PUT" : "POST";

    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
      }),
    });

    setForm({ name: "", description: "", price: "" });
    setEditing(null);
    fetchMenu();
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure you want to delete this item?")) return;
    await fetch(`/api/restaurant/menu/${id}`, { method: "DELETE" });
    fetchMenu();
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading menu...
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto py-10">
      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-gray-900 mb-6"
      >
        Manage Menu
      </motion.h1>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-6 mb-10"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editing ? "Edit Menu Item" : "Add New Item"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <input
            type="text"
            placeholder="Item name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="border border-gray-300 rounded-lg p-2"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
        >
          {editing ? "Update Item" : "Add Item"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setForm({ name: "", description: "", price: "" });
            }}
            className="ml-4 text-gray-600 hover:text-orange-600"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Menu List */}
      <div className="space-y-4">
        {menu.map((item) => (
          <div
            key={item.Menu_ID}
            className="bg-white p-5 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {item.Item_Name}
              </h3>
              <p className="text-sm text-gray-600">{item.Item_Description}</p>
              <p className="text-orange-600 font-bold">
                ₹{item.Price.toFixed(2)}
              </p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => {
                  setEditing(item);
                  setForm({
                    name: item.Item_Name,
                    description: item.Item_Description,
                    price: item.Price.toString(),
                  });
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(item.Menu_ID)}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
