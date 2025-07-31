import React, { useEffect, useState } from "react";
import { getToken, API_BASE_URL } from "@/lib/api";

interface Order {
  product?: string;
  amount: number;
  phone: string;
  receipt: string;
  time: string;
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("Failed to fetch orders");
        const data = await res.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Error loading orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <div className="text-coffee">Loading your orders...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (orders.length === 0) return <div className="text-coffee">No orders found.</div>;

  return (
    <div className="max-w-2xl mx-auto my-8 p-6 bg-white rounded-xl shadow border border-coffee">
      <h2 className="text-xl font-bold text-coffee mb-4">My Orders</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-coffee-light">
            <th className="py-2">Product</th>
            <th className="py-2">Amount</th>
            <th className="py-2">Phone</th>
            <th className="py-2">Receipt</th>
            <th className="py-2">Time</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, idx) => (
            <tr key={idx} className="border-b border-coffee-light/50">
              <td className="py-2">{order.product || "N/A"}</td>
              <td className="py-2">{order.amount}</td>
              <td className="py-2">{order.phone}</td>
              <td className="py-2">{order.receipt}</td>
              <td className="py-2">{new Date(order.time).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 