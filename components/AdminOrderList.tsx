"use client";
import { useState, useEffect } from "react";
import { CheckCircle, Truck, MapPin, Mail, User, AlertCircle, Phone } from "lucide-react"; // 1. Import Phone
import Image from "next/image";

// 1. Strict Types
interface ProductDetails {
  _id: string;
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  _id: string;
  productId: ProductDetails | null;
  quantity: number;
}

interface OrderType {
  _id: string;
  customerName: string;
  email: string;
  mobile?: string; // 2. Ensure mobile is in the interface
  address: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  isPaid: boolean;
  createdAt: string;
}

export default function AdminOrderList({ initialOrders }: { initialOrders: OrderType[] }) {
  const [orders, setOrders] = useState<OrderType[]>(initialOrders || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);

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
      case "Processing": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-amber-100 text-amber-800 border-amber-200";
    }
  };

  return (
    <div className="space-y-8">
      {orders.map((order) => (
        <div key={order._id} className="bg-[#fdf7f2]/95 text-[#3b241f] rounded-2xl shadow-lg border border-[#e5c7a1]/70 overflow-hidden">
          
          {/* Header Row */}
          <div className="bg-[#f8ecdd] px-6 py-4 flex flex-wrap justify-between items-center gap-4 border-b border-[#e5c7a1]/50">
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Order ID</p>
                <p className="font-mono text-xs font-bold text-gray-600">#{order._id.slice(-8).toUpperCase()}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Placed On</p>
                <p className="text-xs font-semibold" suppressHydrationWarning>
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${order.isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                {order.isPaid ? "PAID" : "UNPAID"}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-6 flex flex-col lg:flex-row gap-8">
            
            {/* LEFT COLUMN: Customer & Shipping Details */}
            <div className="lg:w-1/3 space-y-6">
              
              {/* Customer Info */}
              <div className="bg-white/50 p-4 rounded-xl border border-[#e5c7a1]/40 space-y-3">
                <p className="text-[10px] font-bold text-[#a27a55] uppercase border-b border-[#e5c7a1]/20 pb-1 mb-2">
                  Customer Details
                </p>
                <div className="flex items-center gap-3 text-sm">
                  <User size={16} className="text-[#c8924b]" />
                  <span className="font-semibold">{order.customerName}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} className="text-[#c8924b]" />
                  <span className="truncate">{order.email}</span>
                </div>

                {/* 3. RESTORED MOBILE NUMBER DISPLAY */}
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-[#c8924b]" />
                  <span className="truncate">{order.mobile || "N/A"}</span>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white/50 p-4 rounded-xl border border-[#e5c7a1]/40">
                <p className="text-[10px] font-bold text-[#a27a55] uppercase border-b border-[#e5c7a1]/20 pb-1 mb-3">
                  Shipping Address
                </p>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-[#c8924b] mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-700 leading-snug break-words">
                    {order.address || "No address provided"}
                  </p>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="p-4 bg-[#f0dec4]/40 rounded-xl border border-[#e5c7a1]/40">
                <p className="text-[10px] font-bold text-gray-400 uppercase text-center mb-3">Update Status</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => updateStatus(order._id, "Shipped")}
                    // Fix: Allow shipping if status is Pending OR Processing
                    disabled={loadingId === order._id || (order.status !== "Pending" && order.status !== "Processing")}
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
              </div>

            </div>

            {/* RIGHT COLUMN: Items & Total */}
            <div className="flex-1 lg:border-l lg:border-[#e5c7a1]/40 lg:pl-8">
              <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">Order Items</p>
              
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={item._id || i} className="flex items-center gap-4 bg-white/60 p-3 rounded-xl border border-[#e5c7a1]/30 hover:shadow-sm transition">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-200 shrink-0">
                      {item.productId ? (
                          <Image src={item.productId.image} alt={item.productId.name} fill className="object-cover" />
                      ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-300">
                              <AlertCircle size={16} className="text-gray-500" />
                          </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-[#3b241f]">
                          {item.productId ? item.productId.name : "Product Deleted"}
                      </p>
                      <p className="text-xs text-gray-500">Qty: <span className="font-semibold">{item.quantity}</span></p>
                    </div>
                    <p className="text-sm font-bold text-[#c8924b]">
                      ₹{item.productId ? item.quantity * item.productId.price : 0}
                    </p>
                  </div>
                ))}
              </div>

              {/* Total Section */}
              <div className="mt-6 pt-4 border-t-2 border-[#e5c7a1]/30 flex justify-between items-end">
                <div className="text-xs text-gray-500">
                  <p>Includes GST & Shipping</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-[#a27a55] font-bold">Total Amount</p>
                  <p className="text-2xl font-extrabold text-[#3b241f]">₹{order.totalAmount}</p>
                </div>
              </div>
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