import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { items, customerDetails } = await req.json();
    await connectDB();

    // 1. Calculate Total Price Securely (Server-Side)
    const productIds = items.map((item: any) => item._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    let totalAmount = 0;
    const dbItems = items.map((item: any) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === item._id);
      if (!dbProduct) throw new Error("Product not found");
      totalAmount += dbProduct.price * item.quantity;
      return { 
        productId: item._id, 
        quantity: item.quantity,
        price: dbProduct.price // Optional: store snapshot of price
      };
    });

    // 2. Create "Pending" Order in MongoDB
    const newOrder = await Order.create({
      customerName: customerDetails.name,
      email: customerDetails.email,
      address: customerDetails.address,
      totalAmount: totalAmount,
      status: 'Pending',
      isPaid: false,
      items: dbItems,
    });

    // 3. Generate Razorpay Order ID
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(totalAmount * 100), // Amount in paise (e.g. 500.00 -> 50000)
      currency: 'INR',
      receipt: newOrder._id.toString(),
    });

    return NextResponse.json({
      orderId: newOrder._id, // Our DB ID
      razorpayOrderId: razorpayOrder.id, // Razorpay's ID
      amount: totalAmount,
      currency: 'INR'
    });

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}