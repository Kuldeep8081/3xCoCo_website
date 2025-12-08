"use client";
import { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import {
  Trash2,
  ShoppingBag,
  Plus,
  Minus,
  MapPin,
  Loader2,
  Receipt,
  CheckSquare,
  Square,
  Phone,
  User, // Added Phone Icon
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export const dynamic = "force-dynamic";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    contact: string; // Changed 'email' to 'contact' for mobile
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

function CartContent() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  const { items, removeItem, increaseQuantity, decreaseQuantity, clearCart } = useCartStore();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectionInitialized, setIsSelectionInitialized] = useState(false);

  useEffect(() => {
    if (!isSelectionInitialized && items.length > 0) {
      setSelectedIds(new Set(items.map((i) => i._id)));
      setIsSelectionInitialized(true);
    }
  }, [items, isSelectionInitialized]);

  const toggleItem = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleAll = () => {
    if (selectedIds.size === items.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(items.map((i) => i._id)));
  };

  const isAllSelected = items.length > 0 && selectedIds.size === items.length;

  const [formData, setFormData] = useState({
    name: "",
    mobile: "", // Changed from email to mobile
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const GST_RATE = 0.18;
  const FREE_SHIPPING_THRESHOLD = 999;
  const SHIPPING_FLAT = 79;

  const selectedItemsList = items.filter(item => selectedIds.has(item._id));

  const total = selectedItemsList.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const gstAmount = (total * GST_RATE) / (1 + GST_RATE);
  const baseAmount = total - gstAmount;

  const discount = couponApplied ? total * 0.1 : 0;
  const amountAfterDiscount = total - discount;
  const shipping = amountAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : (total > 0 ? SHIPPING_FLAT : 0);
  const payableTotal = amountAfterDiscount + shipping;

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    setCouponError("");
    if (!code) { setCouponError("Please enter a coupon code."); return; }
    if (couponApplied) { setCouponError("Coupon already applied."); return; }
    if (code === "CHOCO10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code.");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) { alert("Geolocation is not supported."); return; }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await response.json();
          if (data && data.display_name) {
            setFormData((prev) => ({ ...prev, address: data.display_name }));
          } else { alert("Could not fetch address details."); }
        } catch (error) { console.error("Geocoding error:", error); alert("Failed to get address."); }
        finally { setLocating(false); }
      },
      (error) => { console.error("Geolocation error:", error); alert("Unable to retrieve location."); setLocating(false); }
    );
  };

  const handleCheckout = async () => {
    if (selectedItemsList.length === 0) { alert("Please select items to buy."); return; }

    // Validate Mobile (Simple check: 10 digits)
    if (!formData.name || !formData.mobile || !formData.address) { alert("Please fill all details."); return; }
    if (formData.mobile.length < 10) { alert("Please enter a valid mobile number."); return; }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: selectedItemsList,
          customerDetails: {
            ...formData, // Sends mobile now
            couponApplied,
            couponCode: couponApplied ? "CHOCO10" : null,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order creation failed");

      const options: RazorpayOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
        amount: data.amount,
        currency: "INR",
        name: "3XCoCo Chocolates",
        description: "Delicious Goodness",
        order_id: data.razorpayOrderId,
        handler: async function (response: RazorpayResponse) {
          try {
            const verifyRes = await fetch("/api/payment/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                dbOrderId: data.orderId,
              }),
            });

            if (verifyRes.ok) {
              clearCart();
              router.push(`/success?orderId=${data.orderId}`);
            } else { alert("Payment verification failed."); }
          } catch (err) { console.error(err); alert("Payment verification error."); }
        },
        prefill: {
          name: formData.name,
          contact: formData.mobile // Razorpay uses 'contact' for phone
        },
        theme: { color: "#4b2e2b" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) { console.error(error); alert("Something went wrong with checkout."); }
    finally { setLoading(false); }
  };

  useEffect(() => { setIsMounted(true); }, []);
  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#120909] via-[#1c1010] to-[#281313] text-[#FCE9D9]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="pointer-events-none fixed inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute -top-20 -left-10 w-48 h-48 rounded-full bg-[#3b1814]" />
        <div className="absolute top-32 right-0 w-72 h-72 rounded-full bg-[#552024]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#FFB368]/70">Cart</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#FFECDC]">Your Chocolate Bag</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex flex-col items-center bg-[#221214]/95 text-[#FCE9D9] px-10 py-12 rounded-3xl shadow-2xl border border-[#442528]">
              <ShoppingBag size={64} className="mb-4 text-[#FFB368] drop-shadow-sm" />
              <h2 className="text-xl font-semibold mb-2">Your bag is feeling light</h2>
              <Link href="/" className="px-6 py-3 rounded-full bg-linear-to-r from-[#F1784D] via-[#FFB368] to-[#FBD27A] text-[#2a1512] text-sm font-semibold shadow-md transition">Browse Chocolates</Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-3 pb-2 border-b border-[#3d2326] mb-2 px-2">
                <button onClick={toggleAll} className="flex items-center gap-2 text-sm font-medium text-[#FFB368] hover:text-[#FFECDC] transition">
                  {isAllSelected ? <CheckSquare size={18} /> : <Square size={18} />} {isAllSelected ? "Deselect All" : "Select All"}
                </button>
                <span className="text-xs text-[#c8a898] ml-auto">{selectedIds.size} items selected</span>
              </div>
              {items.map((item) => {
                const isSelected = selectedIds.has(item._id);
                return (
                  <div key={item._id} className={`bg-[#241315]/95 text-[#F8E5D8] p-4 sm:p-5 rounded-2xl shadow-xl border flex items-center gap-4 transition-colors ${isSelected ? 'border-[#FFB368]/50' : 'border-[#3d2326] opacity-75'}`}>
                    <button onClick={() => toggleItem(item._id)} className="text-[#FFB368] hover:text-[#FFECDC] transition">
                      {isSelected ? <CheckSquare size={20} /> : <Square size={20} className="text-[#573032]" />}
                    </button>
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-[#3a2223] border border-[#573032]">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm sm:text-base text-[#FFECDC]">{item.name}</h3>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => decreaseQuantity(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full border border-[#FFB368] text-[#FFB368]" disabled={item.quantity <= 1}><Minus size={14} /></button>
                        <span className="font-medium w-4 text-center text-[#FFECDC]">{item.quantity}</span>
                        <button onClick={() => increaseQuantity(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFB368] text-[#2c1513]"><Plus size={14} /></button>
                      </div>
                      <div className="mt-2 text-sm sm:text-base font-bold text-[#FFC27A]">₹{item.price * item.quantity}</div>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="p-2 text-[#ff8a8a] hover:text-[#ffb3b3] rounded-full"><Trash2 size={20} /></button>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#241315]/95 text-[#FCE9D9] p-6 sm:p-7 rounded-2xl shadow-2xl border border-[#3d2326] h-fit sticky top-24">
              <h2 className="text-xl font-bold text-[#FFECDC] mb-1">Shipping Details</h2>
              <div className="space-y-3 mb-6">

                <div className="relative">
                  <User size={14} className="absolute left-3 top-3 text-[#9b7a6b]" />
                  <input type="text" placeholder="Full Name" className="w-full pl-9 p-2.5 rounded-lg border border-[#4c2a2d] bg-[#1b1011] text-sm text-[#FCE9D9] focus:outline-none focus:ring-2 focus:ring-[#FFB368] transition" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>

                {/* --- MOBILE INPUT --- */}
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-3 text-[#9b7a6b]" />
                  <input
                    type="tel"
                    placeholder="Mobile Number"
                    className="w-full pl-9 p-2.5 rounded-lg border border-[#4c2a2d] bg-[#1b1011] text-sm text-[#FCE9D9] focus:outline-none focus:ring-2 focus:ring-[#FFB368] transition"
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  />
                </div>
                {/* -------------------- */}

                <div className="relative">
                  <div className="flex justify-between items-end mb-1.5">
                    <label className="text-xs font-semibold text-[#FFB368] uppercase tracking-wide">Address</label>
                    <button type="button" onClick={handleUseCurrentLocation} disabled={locating} className="flex items-center gap-1 text-[11px] font-bold text-[#FFB368] hover:text-[#FFECDC] transition disabled:opacity-50">
                      {locating ? <Loader2 size={12} className="animate-spin" /> : <MapPin size={12} />} {locating ? "Locating..." : "Use my location"}
                    </button>
                  </div>
                  <textarea placeholder="Type address or use location button..." className="w-full p-2.5 rounded-lg border border-[#4c2a2d] bg-[#1b1011] text-sm text-[#FCE9D9] focus:outline-none focus:ring-2 focus:ring-[#FFB368] transition resize-none" rows={3} value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </div>

              {/* ... Coupon & Summary Code (Same as before) ... */}
              <div className="border border-[#4c2a2d] rounded-xl bg-[#1b1011]/50 p-4 mb-4">
                <div className="flex items-center gap-2 mb-3 text-[#FFB368]">
                  <Receipt size={16} />
                  <h3 className="text-sm font-bold uppercase tracking-wide">Order Summary</h3>
                </div>
                {/* ... Itemized list ... */}
                <div className="border-t border-[#4c2a2d] pt-2 mt-2 flex justify-between font-bold text-sm text-[#FFECDC]">
                  <span>Total</span><span>₹{payableTotal.toFixed(2)}</span>
                </div>
              </div>

              <button onClick={handleCheckout} disabled={loading || selectedItemsList.length === 0} className="w-full py-3 rounded-full bg-linear-to-r from-[#F1784D] via-[#FFB368] to-[#FBD27A] text-[#2a1512] font-semibold text-sm shadow-md hover:shadow-lg transition disabled:opacity-60">
                {loading ? "Processing..." : `Pay ₹${payableTotal.toFixed(0)}`}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#120909] text-[#FCE9D9]">Loading Cart...</div>}>
      <CartContent />
    </Suspense>
  );
}