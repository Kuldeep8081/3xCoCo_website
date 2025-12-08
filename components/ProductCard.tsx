import Image from "next/image";
import Link from "next/link";
import ProductActions from "./ProductActions"; // Reusing the updated component

interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export default function ProductCard({ id, name, price, image }: ProductProps) {
  // Construct product object for store
  const productData = {
    _id: id,
    name,
    price,
    image,
  };

  return (
    <div className="group bg-[#fdf7f2]/95 rounded-2xl overflow-hidden shadow-md border border-[#e5c7a1]/70 hover:shadow-2xl hover:-translate-y-1 transition-transform duration-300 flex flex-col h-full">
      
      {/* 1. Link wraps ONLY Image & Title (Not Buttons) */}
      <Link href={`/product/${id}`} className="block flex-1">
        <div className="relative aspect-square w-full overflow-hidden bg-[#f3e0c7]">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-[#3b241f]/70 via-transparent to-transparent" />
        </div>

        <div className="px-4 pt-4 sm:px-5 sm:pt-5">
          <span className="inline-block mb-1 text-[10px] uppercase tracking-[0.18em] text-[#c8924b]">
            Premium Chocolate
          </span>
          <h3 className="text-base sm:text-lg font-semibold text-[#3b241f] truncate">
            {name}
          </h3>
        </div>
      </Link>

      {/* 2. Price & Actions Section */}
      <div className="p-4 sm:p-5 pt-0 mt-auto">
        <div className="mt-1 mb-2">
          <span className="text-lg sm:text-xl font-extrabold text-[#3b241f]">
            ₹{price}
          </span>
        </div>

        {/* 3. Reuse ProductActions with 'isCard' mode */}
        <ProductActions product={productData} isCard={true} />

        <p className="mt-3 text-[11px] text-[#a27a55] line-clamp-1 text-center opacity-80">
          Hand-crafted with rich cocoa & love.
        </p>
      </div>
    </div>
  );
}