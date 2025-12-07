"use client";
import { useState, useEffect } from "react"; // Added useEffect
import { CheckCircle, Truck, AlertCircle } from "lucide-react";
import Image from "next/image";

// 1. Define Strict Types for Props
interface ProductDetails {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  _id: string;
  productId: ProductDetails | null; // Can be null if deleted
  quantity: number;
}

interface OrderType {
  _id: string;
  customerName: string;
  email: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

export default function AdminOrderList({ initialOrders }: { initialOrders: OrderType[] }) {
  // Initialize state with props, ensuring it's an array
  const [orders, setOrders] = useState<OrderType[]>(initialOrders || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // FIX: Sync state with props when page reloads/refreshes
  useEffect(() => {
    setOrders(initialOrders || []);
  }, [initialOrders]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Mark order #${orderId.slice(-4)} as ${newStatus}?`)) return;
    
    setLoadingId(orderId);
    try {
      const res = await fetch("/api/admin/orders/update-status", {
        method: "PATCH",
        body: JSON.stringify({ orderId, status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o))
        );
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      alert("Error updating order");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-green-100 text-green-800 border-green-200";
      case "Shipped": return "bg-blue-100 text-blue-800 border-blue-200";
      default: return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="bg-[#fdf7f2]/95 text-[#3b241f] rounded-2xl shadow-lg border border-[#e5c7a1]/70 overflow-hidden">
          
          {/* Header Row */}
          <div className="bg-[#f8ecdd] px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#e5c7a1]/50">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Order ID</p>
              <p className="font-mono text-xs font-bold text-gray-600">#{order._id.slice(-6).toUpperCase()}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Customer</p>
              <p className="text-sm font-semibold">{order.customerName}</p>
              <p className="text-xs text-gray-500">{order.email}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Payment</p>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${order.isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {order.isPaid ? "PAID" : "UNPAID"}
              </span>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Status</p>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 flex flex-col lg:flex-row gap-8">
            
            {/* Items List */}
            <div className="flex-1 space-y-3">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Ordered Items</p>
              {order.items.map((item, i) => (
                <div key={item._id || i} className="flex items-center gap-4 bg-white/50 p-2 rounded-lg border border-[#e5c7a1]/30">
                  <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-200 shrink-0">
                    {/* Handle populated vs unpopulated items safely */}
                    {item.productId ? (
                        <Image src={item.productId.image} alt={item.productId.name} fill className="object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <AlertCircle size={16} className="text-gray-500" />
                        </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate">
                        {item.productId ? item.productId.name : "Product Deleted"}
                    </p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">
                    ₹{item.productId ? item.quantity * item.productId.price : 0}
                  </p>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-[#e5c7a1]/30 mt-2">
                <span className="font-bold text-sm">Total Bill</span>
                <span className="font-extrabold text-lg">₹{order.totalAmount}</span>
              </div>
            </div>

            {/* Admin Actions */}
            <div className="lg:w-1/3 bg-white/60 p-4 rounded-xl border border-[#e5c7a1]/40 flex flex-col justify-center gap-3">
              <p className="text-xs font-bold text-gray-400 uppercase text-center mb-1">Update Status</p>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => updateStatus(order._id, "Shipped")}
                  disabled={loadingId === order._id || order.status === "Shipped" || order.status === "Delivered"}
                  className="flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg text-xs font-bold hover:bg-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Truck size={14} /> Ship
                </button>

                <button
                  onClick={() => updateStatus(order._id, "Delivered")}
                  disabled={loadingId === order._id || order.status === "Delivered"}
                  className="flex items-center justify-center gap-2 bg-green-100 text-green-700 py-2 rounded-lg text-xs font-bold hover:bg-green-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={14} /> Deliver
                </button>
              </div>
              
              {loadingId === order._id && (
                <p className="text-xs text-center text-gray-500 animate-pulse mt-2">Updating...</p>
              )}
            </div>

          </div>
        </div>
      ))}

      {orders.length === 0 && (
        <div className="text-center py-20 bg-[#fdf7f2]/50 rounded-3xl border border-dashed border-[#e5c7a1]">
          <p className="text-gray-500">No orders found.</p>
        </div>
      )}
    </div>
  );
}