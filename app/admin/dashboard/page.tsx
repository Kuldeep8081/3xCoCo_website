import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Link from "next/link";
import { Delete, Plus } from "lucide-react";

// Force dynamic rendering so you always see new orders without rebuilding
export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await connectDB();

  // Fetch orders, newest first. .lean() makes it faster plain JSON
  const orders = await Order.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">
      {/* Background chocolate blobs */}
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#f3c894]/80">
              Admin
            </p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#fdf7f2]">
              Admin Dashboard
            </h1>
            <p className="text-sm text-[#fbe0c3]/80 mt-1">
              Manage your chocolate orders and products in one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <span className="bg-[#fdf7f2]/95 text-[#3b241f] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#e5c7a1]/70 shadow-sm">
              Total Orders: {orders.length}
            </span>
            <Link
              href="/admin/add-product"
              className="bg-linear-to-r from-[#f6d18b] to-[#c8924b] text-[#3b241f] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition"
            >
              <Plus size={16} /> Add Product
            </Link>
            <Link
              href="/admin/manage-products"
              className="bg-linear-to-r from-[#f6d18b] to-[#c8924b] text-[#3b241f] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition"
            >
              <Delete size={16} /> Update Products
            </Link>
          </div>
        </div>

        {/* Orders Table Card */}
        <div className="bg-[#fdf7f2]/95 text-[#3b241f] rounded-3xl shadow-2xl border border-[#e5c7a1]/70 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#3b241f] text-[#f3c894] uppercase text-[11px] tracking-[0.16em]">
                <tr>
                  <th className="p-4 sm:p-5">Order ID</th>
                  <th className="p-4 sm:p-5">Customer</th>
                  <th className="p-4 sm:p-5">Items</th>
                  <th className="p-4 sm:p-5">Amount</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0dec4]">
                {orders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="hover:bg-[#f8ecdd] transition-colors"
                  >
                    <td className="p-4 sm:p-5 font-mono text-[11px] text-gray-500">
                      {order._id.toString().slice(-6)}…
                    </td>

                    <td className="p-4 sm:p-5 align-top">
                      <div className="font-semibold text-sm">
                        {order.customerName || "Unknown Customer"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.email || "—"}
                      </div>
                    </td>

                    <td className="p-4 sm:p-5 text-sm text-gray-700 align-top">
                      {order.items?.length || 0} items
                    </td>

                    <td className="p-4 sm:p-5 font-bold text-[#3b241f] align-top">
                      ₹{order.totalAmount}
                    </td>

                    <td className="p-4 sm:p-5 align-top">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold ${
                          order.status === "Pending"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : "bg-green-100 text-green-800 border border-green-200"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4 sm:p-5 text-xs text-gray-500 align-top">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}

                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-500 text-sm"
                    >
                      No orders found yet. Your chocolate kingdom is waiting for
                      its first customer.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
