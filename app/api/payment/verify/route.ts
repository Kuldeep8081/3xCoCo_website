import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// 1. Define the expected Request Body Structure
interface VerifyPaymentBody {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  dbOrderId: string;
}

export async function POST(req: Request) {
  try {
    // 2. Parse request body with strict typing
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature, 
      dbOrderId 
    }: VerifyPaymentBody = await req.json();

    const secret = process.env.RAZORPAY_KEY_SECRET;

    if (!secret) {
      throw new Error("Razorpay secret key is missing");
    }

    // 3. Re-create the signature locally for verification
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    // 4. Compare signatures
    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid Signature" }, { status: 400 });
    }

    // 5. Mark Order as Paid in MongoDB
    await connectDB();
    
    // Check if order exists before updating
    const updatedOrder = await Order.findByIdAndUpdate(dbOrderId, { 
      isPaid: true, 
      status: 'Processing' 
    }, { new: true }); // Returns the updated document

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Payment verified successfully" });

  } catch (error: unknown) {
    console.error("Payment Verification Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Verification failed";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}