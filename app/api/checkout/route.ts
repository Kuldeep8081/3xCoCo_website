import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';

// 1. Define Interfaces for Type Safety
interface CartItem {
  _id: string;
  quantity: number;
}

interface CustomerDetails {
  name: string;
  email: string;
  address: string;
  couponCode?: string | null;
}

interface RequestBody {
  items: CartItem[];
  customerDetails: CustomerDetails;
}

// 2. Constants (Must match Frontend Logic)
const FREE_SHIPPING_THRESHOLD = 999;
const SHIPPING_FLAT = 79;

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    // 3. Parse and cast body safely
    const { items, customerDetails }: RequestBody = await req.json();
    
    await connectDB();

    // 4. Calculate Product Total Securely (Server-Side)
    const productIds = items.map((item) => item._id);
    const dbProducts = await Product.find({ _id: { $in: productIds } });

    let productTotal = 0;
    
    const dbItems = items.map((item) => {
      const dbProduct = dbProducts.find((p) => p._id.toString() === item._id);
      
      if (!dbProduct) {
        throw new Error(`Product with ID ${item._id} not found`);
      }
      
      const lineTotal = dbProduct.price * item.quantity;
      productTotal += lineTotal;

      return { 
        productId: item._id, 
        quantity: item.quantity,
        price: dbProduct.price 
      };
    });

    // 5. Apply Coupon Logic (Server-Side Verification)
    let discount = 0;
    if (customerDetails.couponCode === "CHOCO10") {
      discount = productTotal * 0.10; // 10% Discount
    }

    // 6. Apply Shipping Logic
    const amountAfterDiscount = productTotal - discount;
    let shipping = 0;
    
    if (productTotal > 0) {
      shipping = amountAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    }

    // 7. Final Payable Amount
    const finalAmount = amountAfterDiscount + shipping;

    // 8. Create "Pending" Order in MongoDB
    const newOrder = await Order.create({
      customerName: customerDetails.name,
      email: customerDetails.email,
      address: customerDetails.address,
      totalAmount: finalAmount, // Save the final calculated amount
      status: 'Pending',
      isPaid: false,
      items: dbItems,
    });

    // 9. Generate Razorpay Order ID
    // Razorpay expects amount in paise (integers only)
    const amountInPaise = Math.round(finalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise, 
      currency: 'INR',
      receipt: newOrder._id.toString(),
    });

    return NextResponse.json({
      orderId: newOrder._id, // Our DB ID
      razorpayOrderId: razorpayOrder.id, // Razorpay's ID
      amount: amountInPaise, // Send back the calculated amount to frontend
      currency: 'INR'
    });

  } catch (error: unknown) {
    // Type-safe error handling
    console.error("Checkout Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}