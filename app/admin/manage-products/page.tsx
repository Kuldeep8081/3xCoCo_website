import connectDB from "@/lib/db";
import Product from "@/models/Product";
import AdminProductCard from "@/components/AdminProductCard";

export const dynamic = "force-dynamic";

async function getProducts() {
  await connectDB();
  const products = await Product.find({}).lean();
  return products.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));
}

export default async function ManageProducts() {
  const products = await getProducts();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140909] via-[#221013] to-[#2f1717] text-[#FFEBDC]">
      {/* Background chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute -top-12 left-0 w-52 h-52 rounded-full bg-[#3b1814]" />
        <div className="absolute top-32 right-4 w-72 h-72 rounded-full bg-[#552024]" />
        <div className="absolute bottom-0 left-16 w-60 h-60 rounded-full bg-[#70302a]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#F6B56B]/80">
              Admin · Inventory
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#FFEBDC]">
              Visual Chocolate Inventory
            </h1>
            <p className="text-sm text-[#d9afa0] mt-1 max-w-xl">
              Edit, reorganize, or retire chocolates directly from your visual
              grid. Perfect for curating a premium collection.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-[#271315]/80 border border-[#4b2627] text-xs text-[#F6B56B] flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-[#6BEE7D]" />
              <span>
                {products.length} product{products.length !== 1 && "s"} live
              </span>
            </div>
          </div>
        </div>

        {/* Grid Wrapper */}
        <div className="bg-[#271315]/70 backdrop-blur-xl rounded-3xl border border-[#3d2326] shadow-2xl p-4 sm:p-6 lg:p-8">
          {products.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#d9afa0]">
              No chocolates found in the inventory. Start by adding a new
              product from the admin dashboard.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
              {products.map((product: any) => (
                <AdminProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
