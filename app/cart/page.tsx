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
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";

// 1. FORCE DYNAMIC RENDERING
export const dynamic = "force-dynamic";

// --- INTERFACES ---
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
    email: string;
    contact?: string;
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

// 2. Main Content Component
function CartContent() {
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  
  const { items, removeItem, getTotal, increaseQuantity, decreaseQuantity, clearCart } =
    useCartStore();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);

  // ---- COUPON / PRICING LOGIC ----
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState("");

  const GST_RATE = 0.18; 
  const FREE_SHIPPING_THRESHOLD = 999; 
  const SHIPPING_FLAT = 79; 

  const total = getTotal(); 
  const gstAmount = (total * GST_RATE) / (1 + GST_RATE);
  const baseAmount = total - gstAmount; 

  const discount = couponApplied ? total * 0.1 : 0; 
  
  const amountAfterDiscount = total - discount;
  const shipping = amountAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : (total > 0 ? SHIPPING_FLAT : 0);
  
  const payableTotal = amountAfterDiscount + shipping;

  const handleApplyCoupon = () => {
    const code = coupon.trim().toUpperCase();
    setCouponError("");

    if (!code) {
      setCouponError("Please enter a coupon code.");
      return;
    }

    if (couponApplied) {
      setCouponError("Coupon already applied.");
      return;
    }

    if (code === "CHOCO10") {
      setCouponApplied(true);
      setCouponError("");
    } else {
      setCouponApplied(false);
      setCouponError("Invalid coupon code.");
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    setLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.display_name) {
            setFormData((prev) => ({ ...prev, address: data.display_name }));
          } else {
            alert("Could not fetch address details.");
          }
        } catch (error) {
          console.error("Geocoding error:", error);
          alert("Failed to get address from coordinates.");
        } finally {
          setLocating(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please allow location access.");
        setLocating(false);
      }
    );
  };

  const handleCheckout = async () => {
    if (!formData.name || !formData.email || !formData.address) {
      alert("Please fill in your shipping details.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          customerDetails: {
            ...formData,
            couponApplied,
            couponCode: couponApplied ? "CHOCO10" : null,
            pricingBreakup: {
              baseAmount,
              gstAmount,
              total,
              discount,
              shipping,
              payableTotal,
            },
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
            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error(err);
            alert("Payment verification error.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#4b2e2b",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong with the checkout process.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div className="min-h-screen bg-linear-to-b from-[#120909] via-[#1c1010] to-[#281313] text-[#FCE9D9]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />

      <div className="pointer-events-none fixed inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute -top-20 -left-10 w-48 h-48 rounded-full bg-[#3b1814]" />
        <div className="absolute top-32 right-0 w-72 h-72 rounded-full bg-[#552024]" />
        <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full bg-[#70302a]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.25em] text-[#FFB368]/70">Cart</p>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#FFECDC]">Your Chocolate Bag</h1>
          <p className="text-sm text-[#E2BFA5]/85 mt-1">Review your cocoa picks before you checkout.</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-flex flex-col items-center bg-[#221214]/95 text-[#FCE9D9] px-10 py-12 rounded-3xl shadow-2xl border border-[#442528]">
              <ShoppingBag size={64} className="mb-4 text-[#FFB368] drop-shadow-sm" />
              <h2 className="text-xl font-semibold mb-2">Your bag is feeling light</h2>
              <p className="text-sm text-[#c8a898] mb-6">Looks like you haven&apos;t added any chocolates yet.</p>
              <Link href="/" className="px-6 py-3 rounded-full bg-linear-to-r from-[#F1784D] via-[#FFB368] to-[#FBD27A] text-[#2a1512] text-sm font-semibold shadow-md hover:shadow-lg hover:brightness-110 transition">
                Browse Chocolates
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map((item: CartItem) => (
                <div key={item._id} className="bg-[#241315]/95 text-[#F8E5D8] p-4 sm:p-5 rounded-2xl shadow-xl border border-[#3d2326] flex items-center gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-[#3a2223] border border-[#573032]">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-[#FFECDC]">{item.name}</h3>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => decreaseQuantity(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full border border-[#FFB368] text-[#FFB368] hover:bg-[#FFB368] hover:text-[#2c1513] transition disabled:opacity-40" disabled={item.quantity <= 1}><Minus size={14} /></button>
                      <span className="font-medium w-4 text-center text-[#FFECDC]">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full bg-[#FFB368] text-[#2c1513] hover:bg-[#F4934E] transition shadow-sm"><Plus size={14} /></button>
                    </div>
                    <div className="mt-2 text-sm sm:text-base font-bold text-[#FFC27A]">₹{item.price * item.quantity}</div>
                  </div>
                  <button onClick={() => removeItem(item._id)} className="p-2 text-[#ff8a8a] hover:text-[#ffb3b3] hover:bg-[#3a1719] rounded-full transition"><Trash2 size={20} /></button>
                </div>
              ))}
            </div>

            <div className="bg-[#241315]/95 text-[#FCE9D9] p-6 sm:p-7 rounded-2xl shadow-2xl border border-[#3d2326] h-fit">
              <h2 className="text-xl font-bold text-[#FFECDC] mb-1">Shipping Details</h2>
              <div className="space-y-3 mb-6">
                <input type="text" placeholder="Full Name" className="w-full p-2.5 rounded-lg border border-[#4c2a2d] bg-[#1b1011] text-sm text-[#FCE9D9] focus:outline-none focus:ring-2 focus:ring-[#FFB368] transition" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                <input type="email" placeholder="Email Address" className="w-full p-2.5 rounded-lg border border-[#4c2a2d] bg-[#1b1011] text-sm text-[#FCE9D9] focus:outline-none focus:ring-2 focus:ring-[#FFB368] transition" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
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

              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#FFECDC]">Have a coupon?</span>
                  <span className="text-[11px] text-[#FFB368]/80">Try <code className="font-mono">CHOCO10</code></span>
                </div>
                <div className="flex gap-2">
                  <input type="text" placeholder="Enter code" className="flex-1 p-2.5 rounded-lg border border-[#4c2a2d] bg-[#1b1011] text-sm text-[#FCE9D9] focus:outline-none focus:ring-2 focus:ring-[#FFB368]" value={coupon} onChange={(e) => setCoupon(e.target.value)} />
                  <button type="button" onClick={handleApplyCoupon} className="px-4 py-2 rounded-lg bg-[#FFB368] text-[#2b1513] text-xs font-semibold hover:bg-[#F4934E]">Apply</button>
                </div>
                {couponError && <p className="text-[11px] text-red-400 mt-1">{couponError}</p>}
                {couponApplied && !couponError && <p className="text-[11px] text-[#8df5a0] mt-1">Coupon applied!</p>}
              </div>

              <h2 className="text-xl font-bold text-[#FFECDC] mb-2">Order Summary</h2>
              <div className="space-y-1.5 text-sm text-[#E2BFA5]">
                <div className="flex justify-between"><span>Price (excl. GST)</span><span>₹{baseAmount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>GST ({GST_RATE * 100}%)</span><span>₹{gstAmount.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Subtotal</span><span>₹{total.toFixed(2)}</span></div>
                {discount > 0 && <div className="flex justify-between text-[#8df5a0]"><span>Discount</span><span>-₹{discount.toFixed(2)}</span></div>}
                <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-[#8df5a0]">Free</span> : <>₹{shipping.toFixed(2)}</>}</span></div>
              </div>
              <div className="border-t border-[#3b2325] pt-4 mt-4 mb-3 flex justify-between font-bold text-lg text-[#FFECDC]"><span>Grand Total</span><span>₹{payableTotal.toFixed(2)}</span></div>
              
              {/* --- RESTORED TERMS AND CONDITIONS --- */}
              <p className="text-[11px] text-[#b79280] mb-4">
                * Prices are inclusive of GST. By proceeding, you agree to our{" "}
                <Link 
                  href="/terms" 
                  className="underline underline-offset-2 hover:text-[#FFECDC] transition-colors"
                  target="_blank"
                >
                  terms & conditions
                </Link>{" "}
                for a smooth chocolate delivery.
              </p>

              <button onClick={handleCheckout} disabled={loading} className="w-full py-3 rounded-full bg-linear-to-r from-[#F1784D] via-[#FFB368] to-[#FBD27A] text-[#2a1512] font-semibold text-sm shadow-md hover:shadow-lg transition disabled:opacity-60">{loading ? "Processing..." : "Pay with Razorpay"}</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// 3. SUSPENSE WRAPPER
export default function CartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#120909] text-[#FCE9D9]">Loading Cart...</div>}>
      <CartContent />
    </Suspense>
  );
}