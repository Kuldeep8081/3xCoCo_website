"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle, Clock, AlertCircle, MapPin } from "lucide-react";

// 1. Define Strict Types
interface ProductDetails {
  _id: string; // Added _id here so we don't need 'as any' later
  name: string;
  image: string;
  price: number;
}

interface OrderItem {
  productId: ProductDetails | null;
  quantity: number;
}

interface Order {
  _id: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  isPaid: boolean;
  items: OrderItem[];
  address: string | { name: string; address: string }; // Better than 'any'
}

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/my-orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      } else {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusIcon = (status: string) => {
    if (status === "Delivered") return <CheckCircle size={20} className="text-green-600" />;
    if (status === "Shipped") return <Truck size={20} className="text-blue-600" />;
    return <Clock size={20} className="text-amber-600" />;
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">
      {/* Background blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
      </div>

      <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f3c894]/80">History</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#fdf7f2]">
            Your Orders
          </h1>
          <p className="text-sm text-[#fbe0c3]/70 mt-2">
            Track your deliveries and view past purchases.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin w-8 h-8 border-2 border-[#f3c894] border-t-transparent rounded-full mx-auto mb-4"/>
            <p className="text-[#fbe0c3]/70 text-sm">Retrieving your chocolate history...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-[#fdf7f2]/95 text-coco-dark p-12 rounded-3xl text-center shadow-xl border border-[#e5c7a1]/60">
            <Package size={64} className="mx-auto text-[#e0c9aa] mb-4" />
            <h2 className="text-xl font-bold mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-6">Your chocolate journey hasn&quot;t started yet.</p>
            <Link href="/" className="px-8 py-3 rounded-full bg-linear-to-r from-[#4b2e2b] to-[#c8924b] text-white font-bold shadow-lg hover:shadow-xl transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#fdf7f2]/95 text-coco-dark rounded-3xl shadow-xl border border-[#e5c7a1]/60 overflow-hidden transition hover:shadow-2xl">
                
                {/* Order Header Bar */}
                <div className="bg-[#f8ecdd] px-6 py-4 flex flex-wrap gap-6 justify-between items-center border-b border-[#e5c7a1]/50">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Order Placed</p>
                      <p className="text-sm font-semibold text-[#3b241f]">
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Total</p>
                      <p className="text-sm font-bold text-[#3b241f]">₹{order.totalAmount}</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Ship To</p>
                      <div className="flex items-center gap-1 text-sm font-semibold text-[#3b241f]">
                        <MapPin size={12} className="text-[#a27a55]" />
                        <span className="truncate max-w-[150px]">
                          {typeof order.address === 'string' ? 'Your Address' : order.address?.name || 'You'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Order ID</p>
                      <p className="text-xs font-mono text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${order.isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                      {order.isPaid ? "PAID" : "UNPAID"}
                    </div>
                  </div>
                </div>

                {/* Order Content */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Status Column */}
                    <div className="lg:w-1/4 space-y-2">
                      <h3 className="font-bold text-lg flex items-center gap-2 text-[#3b241f]">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {order.status === 'Delivered' 
                          ? "Your package has been delivered. Enjoy!"
                          : order.status === 'Shipped'
                          ? "It's on the way! Watch out for the delivery."
                          : "We are carefully packing your chocolates."}
                      </p>
                    </div>

                    {/* Product List Column */}
                    <div className="flex-1 space-y-4 lg:border-l lg:border-[#e5c7a1]/40 lg:pl-8">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-start pb-4 border-b border-[#e5c7a1]/30 last:border-0 last:pb-0">
                          <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-[#e5c7a1] shrink-0">
                            {item.productId ? (
                              <Image 
                                src={item.productId.image} 
                                alt={item.productId.name} 
                                fill 
                                className="object-cover" 
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full bg-gray-200">
                                <AlertCircle size={20} className="text-gray-400"/>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1">
                            <h4 className="font-bold text-[#3b241f] text-sm">
                              {item.productId ? item.productId.name : "Product No Longer Available"}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">
                              Quantity: <span className="font-semibold">{item.quantity}</span>
                            </p>
                            {item.productId && (
                              <div className="flex items-center gap-2 mt-2">
                                <Link 
                                  // Removed 'as any' casting by adding _id to the interface
                                  href={`/product/${item.productId._id}`} 
                                  className="text-[#c8924b] text-xs font-bold hover:underline"
                                >
                                  View Product
                                </Link>
                              </div>
                            )}
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-[#3b241f] text-sm">
                              ₹{item.productId ? item.productId.price * item.quantity : 0}
                            </p>
                            {item.quantity > 1 && item.productId && (
                                <p className="text-[10px] text-gray-400">
                                    (₹{item.productId.price} each)
                                </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

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