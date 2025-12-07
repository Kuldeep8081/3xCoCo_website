import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import ProductActions from "@/components/ProductActions";

// 1. Fetch data based on the ID in the URL
async function getProduct(id: string) {
  await connectDB();
  const product = await Product.findById(id).lean();
  if (!product) return null;

  return {
    ...product,
    _id: product._id.toString(),
  };
}

// 2. The Page Component
export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  // No need to await params here
  const { id } = await params;
  const product: any = await getProduct(id);

  if (!product) {
    return (
      <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="text-lg">Sorry, this chocolate bar seems to have melted away. 🍫</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">

      {/* Background chocolate shapes */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center text-[#fbe0c3] hover:text-coco-gold mb-8 transition-colors text-sm"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-[#f3c894]/40 px-3 py-1 bg-black/10 backdrop-blur-sm">
            <ArrowLeft size={18} /> Back to Shop
          </span>
        </Link>

        {/* Product Layout Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 bg-[#fdf7f2]/95 text-coco-dark p-6 md:p-10 rounded-3xl shadow-2xl border border-[#e5c7a1]/60">
          {/* Left: Image */}
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-[#f3e0c7] border-4 border-[#f5d2a3] shadow-lg">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Small chocolate info strip under image */}
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-[#7a5b4b]">
              <span className="px-3 py-1 rounded-full bg-[#f5e2c8] border border-[#e5c7a1] font-medium">
                {product.category || "Artisanal Chocolate"}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f5e2c8] border border-[#e5c7a1]">
                🍫 Handcrafted
              </span>
              <span className="px-3 py-1 rounded-full bg-[#f5e2c8] border border-[#e5c7a1]">
                🚚 Free Shipping over ₹499
              </span>
            </div>
          </div>

          {/* Right: Details */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <span className="text-xs font-bold tracking-[0.25em] text-[#c8924b] uppercase mb-2 block">
                {product.category || "Premium Chocolate"}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-[#3b241f] leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Rating Mockup */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5 text-[#f3b24b]">
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
                <Star fill="currentColor" size={18} />
              </div>
              <span className="text-xs text-gray-500 ml-1">
                4.9 • 42 cocoa lovers
              </span>
            </div>

            {/* Description */}
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {product.description ||
                "Indulge in a rich, velvety chocolate crafted with care from the finest cocoa beans. Perfect for gifting, sharing, or keeping all to yourself."}
            </p>

            {/* Price & small meta */}
            <div className="flex items-baseline gap-3">
              <div className="text-3xl md:text-4xl font-extrabold text-[#3b241f]">
                ₹{product.price}
              </div>
              <span className="text-xs md:text-sm text-gray-500">
                Inclusive of all taxes
              </span>
            </div>

            {/* Divider */}
            <div className="h-px bg-linear-to-r from-transparent via-[#e5c7a1] to-transparent w-full" />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-1">
              {/* Client Component for Interactivity */}
              <ProductActions product={product} />
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs md:text-sm text-gray-600 pt-3">
              <div className="rounded-xl bg-[#f5e2c8]/60 px-3 py-2">
                <p className="font-semibold text-[#5c4033]">Free Delivery</p>
                <p className="text-[11px] md:text-xs">
                  On all orders above <span className="font-medium">₹499</span>.
                </p>
              </div>
              <div className="rounded-xl bg-[#f5e2c8]/60 px-3 py-2">
                <p className="font-semibold text-[#5c4033]">Freshly Packed</p>
                <p className="text-[11px] md:text-xs">
                  Crafted in small batches for maximum freshness.
                </p>
              </div>
              <div className="rounded-xl bg-[#f5e2c8]/60 px-3 py-2">
                <p className="font-semibold text-[#5c4033]">Secure Checkout</p>
                <p className="text-[11px] md:text-xs">
                  100% safe payments with end-to-end encryption.
                </p>
              </div>
            </div>

            {/* Tiny icons row */}
            <div className="text-[11px] text-gray-500 flex flex-wrap gap-4 mt-1">
              <span>🚚 Free Shipping</span>
              <span>🛡️ Secure Checkout</span>
              <span>💝 Perfect for gifting</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
