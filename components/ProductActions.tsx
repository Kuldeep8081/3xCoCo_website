"use client";

import React, { useState } from "react";
import { ShoppingCart, Zap, Loader2 } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useRouter } from "next/navigation";

export default function ProductActions({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false); // To show spinner while checking auth

  // Helper function to check if user is logged in
  const checkAuth = async () => {
    try {
      // We try to hit a protected route. 
      // If it returns 200/OK, we are logged in. If 401, we are not.
      const res = await fetch("/api/orders/my-orders"); 
      if (!res.ok) {
        throw new Error("Not logged in");
      }
      return true;
    } catch (error) {
      // If check fails, redirect to login
      router.push("/login");
      return false;
    }
  };

  const handleAddToCart = async () => {
    setLoading(true);
    const isLoggedIn = await checkAuth();
    setLoading(false);

    if (isLoggedIn) {
      addItem(product);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  const handleBuyNow = async () => {
    setLoading(true);
    const isLoggedIn = await checkAuth();
    setLoading(false);

    if (isLoggedIn) {
      addItem(product);
      router.push("/cart");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-10 pt-2">
      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="flex-1 rounded-full font-semibold text-sm tracking-wide py-3 px-6 flex items-center justify-center gap-2 bg-linear-to-r from-[#f6d18b] to-[#c8924b] text-[#3b241f] shadow-md border border-[#e5c7a1]/60 hover:shadow-lg hover:brightness-105 transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <ShoppingCart size={18} />}
        {loading ? "Checking..." : added ? "Added!" : "Add to Cart"}
      </button>

      {/* Buy Now */}
      <button
        onClick={handleBuyNow}
        disabled={loading}
        className="flex-1 rounded-full font-semibold text-sm tracking-wide py-3 px-6 flex items-center justify-center gap-2 border-2 border-[#4b2e2b] text-[#4b2e2b] bg-[#fffaf5] hover:bg-[#4b2e2b] hover:text-white shadow-sm transition disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
        {loading ? "Please wait..." : "Buy Now"}
      </button>
    </div>
  );
}