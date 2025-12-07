"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Dark",
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
      }),
    });

    if (res.ok) {
      alert("Chocolate Added Successfully!");
      router.push("/");
    } else {
      alert("Failed to add product");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream flex items-center justify-center px-4 py-10">
      {/* Background chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      <div className="relative w-full max-w-2xl">
        <h1 className="text-center text-xs uppercase tracking-[0.3em] text-[#f3c894]/80 mb-2">
          Admin
        </h1>
        <h2 className="text-center text-3xl md:text-4xl font-serif font-bold text-[#fdf7f2] mb-6">
          Add New Chocolate
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-[#fdf7f2]/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border border-[#e5c7a1]/60 space-y-6"
        >
          {/* Product Name */}
          <div>
            <label className="block text-sm font-semibold text-[#5c4033] mb-1">
              Product Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-sm text-[#3b241f] focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition"
              placeholder="Eg. Hazelnut Dark Delight"
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-[#5c4033] mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-sm text-[#3b241f] focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition resize-none"
              placeholder="Write a tempting description for this chocolate..."
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Tip: Mention flavor notes like{" "}
              <span className="italic">nutty, caramel, 70% cocoa</span>.
            </p>
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#5c4033] mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                required
                min="1"
                className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-sm text-[#3b241f] focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition"
                placeholder="Eg. 299"
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#5c4033] mb-1">
                Category
              </label>
              <select
                className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-sm text-[#3b241f] focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent transition"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
              >
                <option value="Dark">Dark Chocolate</option>
                <option value="Milk">Milk Chocolate</option>
                <option value="White">White Chocolate</option>
                <option value="Truffle">Truffle</option>
                <option value="Assorted">Assorted Box</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-[#5c4033] mb-1">
              Image URL
            </label>
            <input
              type="text"
              required
              placeholder="https://..."
              className="w-full p-3 rounded-lg border border-[#e5c7a1] bg-[#fffaf5] text-sm text-[#3b241f] focus:outline-none focus:ring-2 focus:ring-[#c8924b] focus:border-transparent placeholder:text-[#c1a38a] transition"
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Paste a link from Unsplash or your image host. Use rich, close-up shots.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-2 bg-linear-to-r from-[#4b2e2b] via-[#6b3b2e] to-[#c8924b] text-white p-3.5 rounded-full font-semibold text-sm tracking-wide shadow-md hover:shadow-lg hover:brightness-105 transition"
          >
            Add Chocolate to Store
          </button>

          <p className="text-[11px] text-center text-gray-500 mt-2">
            Make sure details are accurate – your customers can almost taste it from the page.
          </p>
        </form>
      </div>
    </div>
  );
}
