"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cartStore";

export default function AddToCartBtn({ product }: { product: any }) {
  const addItem = useCartStore((state) => state.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <button
      onClick={handleAddToCart}
      className="flex-1 rounded-full font-semibold text-sm tracking-wide py-3 px-6 flex items-center justify-center gap-2 bg-linear-to-r from-[#f6d18b] to-[#c8924b] text-[#3b241f] shadow-md border border-[#e5c7a1]/60 hover:shadow-lg hover:brightness-105 transition"
    >
      <ShoppingCart size={18} />
      {added ? "Added!" : "Add to Cart"}
    </button>
  );
}
