import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import AdminOrderList from "@/components/AdminOrderList";
import { Types } from "mongoose";

export const dynamic = "force-dynamic";

interface ProductDoc {
  _id: Types.ObjectId;
  name: string;
  image: string;
  price: number;
}

interface OrderItemDoc {
  _id: Types.ObjectId;
  productId: ProductDoc | null;
  quantity: number;
}

interface OrderDoc {
  _id: Types.ObjectId;
  customerName: string;
  email: string;
  mobile?: string; // 1. Add mobile here
  address: string;
  items: OrderItemDoc[];
  totalAmount: number;
  status: string;
  isPaid: boolean;
  createdAt: Date;
}

export default async function AdminDashboard() {
  await connectDB();

  const rawOrders = await Order.find({})
    .populate({
      path: "items.productId",
      model: Product,
      select: "name image price",
    })
    .sort({ createdAt: -1 })
    .lean();

  // 2. Add mobile to the data mapping
  const orders = (rawOrders as unknown as OrderDoc[]).map((order) => ({
    _id: order._id.toString(),
    customerName: order.customerName,
    email: order.email,
    mobile: order.mobile || "N/A", // <--- PASS MOBILE TO FRONTEND
    address: order.address,
    totalAmount: order.totalAmount,
    status: order.status,
    isPaid: order.isPaid,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      _id: item._id.toString(),
      quantity: item.quantity,
      productId: item.productId
        ? {
            _id: item.productId._id.toString(),
            name: item.productId.name,
            image: item.productId.image,
            price: item.productId.price,
          }
        : null,
    })),
  }));

  return (
    <div className="min-h-screen bg-linear-to-b from-coco-dark via-[#4b2e2b] to-coco-cream text-coco-cream">
      <div className="pointer-events-none fixed inset-0 opacity-20 mix-blend-multiply">
        <div className="absolute -top-16 -left-10 w-40 h-40 rounded-full bg-[#3b241f]" />
        <div className="absolute top-32 right-10 w-64 h-64 rounded-full bg-[#5a362f]" />
        <div className="absolute bottom-10 left-10 w-48 h-48 rounded-full bg-[#7b4a34]" />
      </div>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#f3c894]/80">Admin</p>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#fdf7f2]">Admin Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <span className="bg-[#fdf7f2]/95 text-[#3b241f] px-4 py-2 rounded-full text-xs sm:text-sm font-semibold border border-[#e5c7a1]/70 shadow-sm">
              Total Orders: {orders.length}
            </span>
            <Link href="/admin/add-product" className="bg-linear-to-r from-[#f6d18b] to-[#c8924b] text-[#3b241f] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition">
              <Plus size={16} /> Add Product
            </Link>
            <Link href="/admin/manage-products" className="bg-linear-to-r from-[#f6d18b] to-[#c8924b] text-[#3b241f] px-4 py-2 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md hover:shadow-lg hover:brightness-105 transition">
              <Trash2 size={16} /> Update Products
            </Link>
          </div>
        </div>

        <AdminOrderList initialOrders={orders} />
      </main>
    </div>
  );
}