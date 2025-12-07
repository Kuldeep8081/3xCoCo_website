"use client";
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Save, ArrowLeft, Loader2, AlertCircle } from "lucide-react";

export default function EditProduct() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    image: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Fetch Product Data
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        setForm({
          name: data.name || "",
          price: String(data.price ?? ""),
          description: data.description || "",
          category: data.category || "Dark",
          image: data.image || "",
        });
      } catch (err) {
        setError("Could not load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      if (res.ok) {
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#140909] via-[#221013] to-[#2f1717] flex flex-col items-center justify-center text-[#FFEBDC]">
        <Loader2 size={48} className="animate-spin mb-4 text-[#F6B56B]" />
        <p className="font-serif text-lg tracking-wide">
          Tempering your chocolate details...
        </p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-b from-[#140909] via-[#221013] to-[#2f1717] flex flex-col items-center justify-center text-[#ffb3b3]">
        <AlertCircle size={48} className="mb-4" />
        <p className="font-bold">{error}</p>
        <Link
          href="/admin/dashboard"
          className="mt-4 underline text-[#FFEBDC]"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#140909] via-[#221013] to-[#2f1717] text-[#FFEBDC] p-6 md:p-12">
      {/* Background chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-25 mix-blend-multiply">
        <div className="absolute top-6 right-0 w-64 h-64 rounded-full bg-[#4a201c]" />
        <div className="absolute bottom-0 left-4 w-56 h-56 rounded-full bg-[#703024]" />
      </div>

      <div className="relative max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/admin/dashboard"
            className="p-2 rounded-full bg-[#2b1516]/70 hover:bg-[#3a1b1d] border border-[#5a3032] transition text-[#FFEBDC]"
          >
            <ArrowLeft size={22} />
          </Link>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#F6B56B]/80">
              Edit Chocolate
            </p>
            <h1 className="text-3xl font-serif font-bold text-[#FFEBDC]">
              Update Product
            </h1>
            <p className="text-xs text-[#d9afa0] mt-1">
              Refine flavor notes, pricing, and visuals.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <form
          onSubmit={handleUpdate}
          className="bg-[#271315]/95 backdrop-blur-md text-[#FFEBDC] p-8 rounded-3xl shadow-2xl border border-[#4b2627]/70 space-y-6"
        >
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#F6B56B] mb-1">
              Product Name
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] focus:border-transparent placeholder:text-[#b58c7f] transition"
              placeholder="e.g. Hazelnut Truffle Bliss"
            />
          </div>

          {/* Price & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-[#F6B56B] mb-1">
                Price (₹)
              </label>
              <input
                required
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] focus:border-transparent placeholder:text-[#b58c7f] transition"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wide text-[#F6B56B] mb-1">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] focus:border-transparent transition"
              >
                <option value="Dark">Dark</option>
                <option value="Milk">Milk</option>
                <option value="White">White</option>
                <option value="Truffle">Truffle</option>
                <option value="Gift Box">Gift Box</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#F6B56B] mb-1">
              Description
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] focus:border-transparent placeholder:text-[#b58c7f] transition resize-none"
              placeholder="Describe the flavor profile, cocoa %, notes like hazelnut, caramel, sea salt..."
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#F6B56B] mb-1">
              Image URL
            </label>
            <input
              required
              type="text"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="w-full p-3 rounded-xl border border-[#54302f] bg-[#1a0e0f] text-sm text-[#FFEBDC] focus:outline-none focus:ring-2 focus:ring-[#F6B56B] focus:border-transparent placeholder:text-[#b58c7f] transition"
              placeholder="https://images.unsplash.com/..."
            />
            <p className="text-[11px] text-[#c29a8c] mt-1">
              Use a close-up, warm-toned shot for a premium chocolate feel.
            </p>
          </div>

          {/* Actions */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/admin/dashboard"
              className="flex-1 py-3 text-center rounded-full border-2 border-[#F6B56B]/70 text-[#F6B56B] font-semibold text-sm hover:bg-[#3a1a1b] hover:border-[#F6B56B] transition"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#F1784D] via-[#F6B56B] to-[#FBD27A] text-[#2b1513] font-semibold text-sm shadow-lg hover:shadow-xl hover:brightness-110 transition flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {saving ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving Changes..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
