"use client";
import { useEffect, Suspense } from "react"; // 1. Import Suspense
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";

// 2. Rename the main logic to 'SuccessContent'
function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (orderId) {
      clearCart();
      // You can confirm order here if not using webhooks
    }
  }, [orderId, clearCart]);

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream flex items-center justify-center p-6">
      {/* Background cocoa blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      <div className="relative bg-[#fdf7f2]/95 backdrop-blur-sm p-10 rounded-3xl shadow-2xl border border-[#e5c7a1]/60 max-w-md w-full text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto drop-shadow-md mb-6" />

        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#3b241f] mb-3">
          Payment Successful!
        </h1>

        <p className="text-sm text-[#7a5b4b] mb-6">
          Thank you for your purchase! Your chocolates are being prepared with
          love & cocoa magic. 🍫✨
        </p>

        <div className="bg-[#f8ecdd] p-4 rounded-xl text-sm border border-[#e5c7a1] mb-6">
          <span className="block text-[11px] uppercase tracking-[0.2em] text-[#a27855]">
            Order ID
          </span>
          <span className="font-mono font-bold text-[#3b241f] text-sm">
            {orderId || "—"}
          </span>
        </div>

        <Link
          href="/"
          className="block w-full py-3 rounded-full bg-linear-to-r from-[#4b2e2b] via-[#6b3b2e] to-[#c8924b] text-white font-semibold text-sm shadow-md hover:shadow-lg hover:brightness-105 transition"
        >
          Continue Shopping
        </Link>

        {/* Tiny footer message */}
        <p className="mt-4 text-[11px] text-gray-500">
          A confirmation email will be sent shortly. Check your inbox!
        </p>
      </div>
    </div>
  );
}

// 3. Export the Suspense Wrapper
export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream flex items-center justify-center">
        <p className="text-[#fdf7f2] animate-pulse">Verifying Payment...</p>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}