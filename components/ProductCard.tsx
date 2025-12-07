import Image from "next/image";
import Link from "next/link";

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductProps) {
  return (
    <Link href={`/product/${id}`} className="group">
      <div className="bg-[#fdf7f2]/95 rounded-2xl overflow-hidden shadow-md border border-[#e5c7a1]/70 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300">
        {/* Image Container */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#f3e0c7]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Subtle bottom gradient overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#3b241f]/70 via-transparent to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {/* Small label */}
          <span className="inline-block mb-1 text-[10px] uppercase tracking-[0.18em] text-[#c8924b]">
            Premium Chocolate
          </span>

          <h3 className="text-base sm:text-lg font-semibold text-[#3b241f] truncate">
            {name}
          </h3>

          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg sm:text-xl font-extrabold text-[#3b241f]">
              ₹{price}
            </span>

            <button
              className="inline-flex items-center px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-[0.16em] bg-linear-to-r from-[#4b2e2b] via-[#6b3b2e] to-[#c8924b] text-white shadow-sm group-hover:shadow-md group-hover:brightness-105 transition"
            >
              Taste Now
            </button>
          </div>

          {/* Tiny footer line */}
          <p className="mt-2 text-[11px] text-[#a27a55] line-clamp-1">
            Hand-crafted with rich cocoa & love.
          </p>
        </div>
      </div>
    </Link>
  );
}
