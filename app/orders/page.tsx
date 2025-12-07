"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Truck, CheckCircle, Clock } from "lucide-react";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders/my-orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        } else {
          // If not logged in, redirect to login
          window.location.href = "/login";
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "Delivered")
      return <CheckCircle className="text-green-500" size={18} />;
    if (status === "Shipped")
      return <Truck className="text-blue-500" size={18} />;
    return <Clock className="text-yellow-500" size={18} />;
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "Delivered")
      return "bg-green-50 text-green-700 border-green-200";
    if (status === "Shipped")
      return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-amber-50 text-amber-700 border-amber-200";
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">

      {/* Background chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      <main className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Page Heading */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f3c894]/80">
            Orders
          </p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#fdf7f2]">
            My Chocolate Orders
          </h1>
          <p className="text-sm text-[#fbe0c3]/80 mt-1">
            Track all your past cocoa cravings in one place.
          </p>
        </div>

        {loading ? (
          <div className="bg-[#fdf7f2]/90 text-coco-dark rounded-2xl shadow-xl border border-[#e5c7a1]/60 p-8 text-center">
            <p className="text-sm font-medium mb-2">Loading your chocolates...</p>
            <p className="text-xs text-gray-500">
              Melting the finest orders just for you. 🍫
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#fdf7f2]/95 text-coco-dark p-10 rounded-2xl text-center shadow-xl border border-[#e5c7a1]/60">
            <Package size={48} className="mx-auto text-[#e0c9aa] mb-4" />
            <h2 className="text-lg font-semibold mb-1">
              Your chocolate jar is empty
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              You haven&apos;t ordered anything yet. Time to treat yourself!
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-linear-to-r from-[#4b2e2b] via-[#6b3b2e] to-[#c8924b] text-white text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-105 transition"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-[#fdf7f2]/95 text-coco-dark rounded-2xl shadow-xl border border-[#e5c7a1]/60 overflow-hidden"
              >
                {/* Order Header */}
                <div className="bg-[#f8ecdd] px-5 py-4 flex flex-col sm:flex-row justify-between gap-3 border-b border-[#e5c7a1]/70">
                  <div>
                    <p className="text-[11px] text-[#a27a55] uppercase tracking-[0.2em]">
                      Order ID
                    </p>
                    <p className="font-mono text-xs sm:text-sm font-bold text-[#3b241f] break-all">
                      {order._id}
                    </p>
                  </div>
                  <div className="flex flex-col items-start sm:items-end">
                    <p className="text-[11px] text-[#a27a55] uppercase tracking-[0.2em]">
                      Date Placed
                    </p>
                    <p className="text-xs sm:text-sm font-semibold">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-5 sm:px-6 sm:py-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Order Status
                      </h3>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border text-xs px-3 py-1 font-medium ${getStatusBadgeClass(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      {order.status === "Shipped" && (
                        <p className="text-xs text-gray-500 mt-1">
                          Tracking ID:{" "}
                          <span className="font-mono font-semibold">
                            #TRK-{order._id.slice(-4)}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="text-right space-y-1">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Total Amount
                      </p>
                      <p className="text-2xl font-extrabold text-[#3b241f]">
                        ₹{order.totalAmount}
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Inclusive of all taxes
                      </p>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="border-t border-[#f0dec4] pt-4">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-[0.18em]">
                      Items Ordered
                    </p>
                    <ul className="space-y-2">
                      {order.items.map((item: any, index: number) => (
                        <li
                          key={index}
                          className="flex justify-between text-xs sm:text-sm"
                        >
                          <span className="text-gray-700">
                            Chocolate (ID:{" "}
                            <span className="font-mono text-[11px]">
                              {item.productId}
                            </span>
                            )
                          </span>
                          <span className="font-semibold text-[#3b241f]">
                            x {item.quantity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tiny footer line */}
                  <div className="mt-4 flex flex-wrap gap-3 text-[11px] text-gray-500">
                    <span>🍫 Freshly packed for you</span>
                    <span>🚚 Trackable shipping</span>
                    <span>💝 Perfect for gifting & sharing</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
