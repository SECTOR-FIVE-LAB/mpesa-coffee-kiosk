import React, { useEffect, useState } from "react";
import { getToken, API_BASE_URL } from "@/lib/api";
import { toast } from "sonner";

interface Order {
  _id: string;
  username: string;
  amount: number;
  phone: string;
  receipt: string;
  time: string;
}

export default function AdminPanel() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/orders`, {
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

  const deleteOrder = async (receipt: string) => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE_URL}/admin/orders/${receipt}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to delete order");
      toast.success("Order deleted successfully");
      fetchOrders(); // Refresh the list
    } catch (err: any) {
      toast.error(err.message || "Failed to delete order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <div className="text-coffee text-center p-8">Loading orders...</div>;
  if (error) return <div className="text-red-600 text-center p-8">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-xl shadow border border-coffee">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-coffee">Admin Panel - All Orders</h2>
        <button
          onClick={fetchOrders}
          className="px-4 py-2 bg-coffee text-white rounded hover:bg-coffee-dark transition"
        >
          Refresh
        </button>
      </div>
      
      {orders.length === 0 ? (
        <div className="text-center text-coffee py-8">No orders found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-coffee-light bg-coffee-light/10">
                <th className="py-3 px-4 font-semibold text-coffee">Username</th>
                <th className="py-3 px-4 font-semibold text-coffee">Amount</th>
                <th className="py-3 px-4 font-semibold text-coffee">Phone</th>
                <th className="py-3 px-4 font-semibold text-coffee">Receipt</th>
                <th className="py-3 px-4 font-semibold text-coffee">Time</th>
                <th className="py-3 px-4 font-semibold text-coffee">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b border-coffee-light/30 hover:bg-coffee-light/5">
                  <td className="py-3 px-4">{order.username || 'Guest'}</td>
                  <td className="py-3 px-4">KES {order.amount}</td>
                  <td className="py-3 px-4">{order.phone}</td>
                  <td className="py-3 px-4 font-mono text-sm">{order.receipt}</td>
                  <td className="py-3 px-4">{new Date(order.time).toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => deleteOrder(order.receipt)}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
