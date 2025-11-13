"use client";

import { useEffect, useState } from "react";

export default function AddressesPage() {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadAddresses() {
    const res = await fetch("/api/user/addresses");
    const data = await res.json();
    setAddresses(data);
    setLoading(false);
  }

  useEffect(() => {
    loadAddresses();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-orange-50">
      <h1 className="text-3xl font-bold mb-6">Saved Addresses</h1>

      {loading ? (
        <p>Loading...</p>
      ) : addresses.length === 0 ? (
        <p>You have no saved addresses.</p>
      ) : (
        <div className="space-y-4">
          {addresses.map((a: any) => (
            <div key={a.Address_ID} className="bg-white p-4 rounded-xl shadow">
              <p>{a.Address_First_Line}</p>
              {a.Address_Second_Line && <p>{a.Address_Second_Line}</p>}
              <p>
                {a.City} - {a.Pincode}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
