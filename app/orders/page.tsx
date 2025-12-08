"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Package, Truck, CheckCircle, Clock, AlertCircle, MapPin, User, Phone } from "lucide-react";

// 1. Strict Interface including Contact Details & Product ID
interface ProductDetails {
  _id: string;
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
  address: string; 
  customerName: string; 
  email: string;
  mobile?: string; // Added mobile field
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
            Track your deliveries and review order details.
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
            <Link href="/" className="px-8 py-3 rounded-full bg-linear-to-r from-[#4b2e2b] to-[#c8924b] text-white font-bold shadow-lg hover:shadow-xl transition">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order._id} className="bg-[#fdf7f2]/95 text-coco-dark rounded-3xl shadow-xl border border-[#e5c7a1]/60 overflow-hidden">
                
                {/* Header */}
                <div className="bg-[#f8ecdd] px-6 py-4 flex flex-wrap gap-6 justify-between items-center border-b border-[#e5c7a1]/50">
                  <div className="flex flex-wrap gap-8">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Placed On</p>
                      <p className="text-sm font-semibold text-[#3b241f]" suppressHydrationWarning>
                        {new Date(order.createdAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Total Amount</p>
                      <p className="text-sm font-bold text-[#3b241f]">₹{order.totalAmount}</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold">Order ID</p>
                      <p className="text-xs font-mono text-gray-500">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${order.isPaid ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                    {order.isPaid ? "PAID" : "UNPAID"}
                  </div>
                </div>

                <div className="p-6 flex flex-col lg:flex-row gap-8">
                  
                  {/* Left Column: Status & Contact */}
                  <div className="lg:w-1/3 space-y-6">
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2 text-[#3b241f] mb-1">
                        {getStatusIcon(order.status)}
                        {order.status}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {order.status === 'Delivered' ? "Package delivered successfully." : "Your order is being processed."}
                      </p>
                    </div>

                    <div className="bg-white/50 p-4 rounded-xl border border-[#e5c7a1]/40 space-y-3">
                      <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold border-b border-[#e5c7a1]/20 pb-1 mb-2">Shipping Details</p>
                      
                      <div className="flex items-center gap-2 text-sm text-[#3b241f]">
                        <User size={14} className="text-[#a27a55]" />
                        <span className="font-semibold">{order.customerName}</span>
                      </div>
                      
                      {/* --- UPDATED TO SHOW MOBILE INSTEAD OF EMAIL --- */}
                      <div className="flex items-center gap-2 text-sm text-[#3b241f]">
                        <Phone size={14} className="text-[#a27a55]" />
                        <span className="truncate">{order.mobile || "No mobile provided"}</span>
                      </div>
                      {/* ----------------------------------------------- */}

                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin size={14} className="mt-0.5 text-[#a27a55] shrink-0" />
                        <span className="leading-snug">{order.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Product List */}
                  <div className="flex-1 space-y-4 lg:border-l lg:border-[#e5c7a1]/40 lg:pl-8">
                    <p className="text-[10px] uppercase tracking-wider text-[#a27a55] font-bold mb-3">Items Ordered</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-4 items-start pb-4 border-b border-[#e5c7a1]/30 last:border-0">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 border border-[#e5c7a1] shrink-0">
                          {item.productId ? (
                            <Image src={item.productId.image} alt={item.productId.name} fill className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full bg-gray-200"><AlertCircle size={20} className="text-gray-400"/></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-[#3b241f] text-sm">{item.productId ? item.productId.name : "Product Unavailable"}</h4>
                          <p className="text-xs text-gray-500 mt-1">Qty: <span className="font-semibold">{item.quantity}</span></p>
                          {item.productId && (
                            <Link href={`/product/${item.productId._id}`} className="text-[#c8924b] text-xs font-bold hover:underline mt-1 inline-block">
                              View Product
                            </Link>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-[#3b241f] text-sm">₹{item.productId ? item.productId.price * item.quantity : 0}</p>
                          {item.quantity > 1 && item.productId && <p className="text-[10px] text-gray-400">(₹{item.productId.price} each)</p>}
                        </div>
                      </div>
                    ))}
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