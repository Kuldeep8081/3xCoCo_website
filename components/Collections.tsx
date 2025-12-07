import ProductCard from "@/components/ProductCard";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { Types } from "mongoose"; // 1. Import Mongoose Types

// Ensure this runs on Node.js (for Mongoose) and is always dynamic
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// 2. Define the exact shape of the raw MongoDB document
interface ProductDoc {
  _id: Types.ObjectId; // Strictly typed as ObjectId, not 'any'
  name: string;
  price: number;
  image: string;
  description?: string;
  category?: string;
}

// 3. Define the shape of the data for the frontend (serialized)
interface SerializedProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
}

async function getProducts(): Promise<SerializedProduct[]> {
  await connectDB();

  const rawProducts = await Product.find({}).lean();

  console.log("[Collections] Fetched total products:", rawProducts.length);

  // 4. Cast the raw result to our strict ProductDoc interface
  const products = rawProducts as unknown as ProductDoc[];

  // 5. Transform ObjectId to string for the frontend
  return products.map((p) => ({
    _id: p._id.toString(), 
    name: p.name,
    price: p.price,
    image: p.image,
  }));
}

export default async function Collections() {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">
      {/* Background chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      {/* Product Grid */}
      <section
        id="shop"
        className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16 md:py-20"
      >
        <div className="text-center mb-10 sm:mb-12">
          <p className="text-xs uppercase tracking-[0.25em] text-[#f3c894]/80">
            Collections
          </p>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#fdf7f2] mt-2">
            Our Chocolate Collection
          </h2>
          <p className="mt-2 text-sm text-[#fbe0c3]/85 max-w-xl mx-auto">
            Explore handcrafted dark, milk, white and truffle chocolates,
            curated for every cocoa lover.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 sm:gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-sm text-[#fbe0c3]/80">
              No chocolates found. Time to add some sweetness to the shop.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}