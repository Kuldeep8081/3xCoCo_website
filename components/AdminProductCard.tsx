"use client";
import Image from "next/image";
import { Edit3, Trash2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminProductCard({ product }: { product: any }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${product.name}"?`)) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Failed to delete product");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative group bg-[#2a1718]/80 border border-[#3d2326] rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm text-[#FFEBDC] hover:shadow-[0_0_15px_rgba(255,180,130,0.3)] transition">
      {/* Admin Overlay */}
      <div className="absolute inset-0 bg-[#000000bd] backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col items-center justify-center gap-3 p-4">
        
        <button
          onClick={() => router.push(`/admin/edit-product/${product._id}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r from-[#e8b471] to-[#b86b33] text-[#3B1F14] hover:scale-105 shadow-lg transition"
        >
          <Edit3 size={16} /> Edit Details
        </button>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold bg-[#792d29] text-white hover:bg-[#a73736] hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100"
        >
          <Trash2 size={16} /> {isDeleting ? "Deleting..." : "Delete Item"}
        </button>
      </div>

      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-sm sm:text-base text-[#FFEBDC] truncate">
          {product.name}
        </h3>
        <p className="text-[#E9B677] font-bold mt-1 text-sm sm:text-base">
          ₹{product.price}
        </p>
      </div>

      {/* Soft Highlight Border */}
      <div className="absolute inset-0 rounded-2xl pointer-events-none border border-transparent group-hover:border-[#F6B56B]/50 transition"></div>
    </div>
  );
}
