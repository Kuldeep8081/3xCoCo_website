import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Razorpay from 'razorpay';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

// 1. Define Strict Interfaces
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

// Interface for the decoded JWT token
interface DecodedToken extends JwtPayload {
  id: string;
  email: string;
}

// 2. Constants
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

    // --- CRITICAL FIX: FORCE LOGGED-IN EMAIL ---
    let finalEmail = customerDetails.email; // Default to form input (guest)

    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (token) {
      try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error("JWT_SECRET is not defined");

        // Verify and cast to our specific token type
        const decoded = jwt.verify(token, secret) as DecodedToken;
        
        // Fetch the REAL user from DB to ensure email matches exactly
        const user = await User.findById(decoded.id);
        if (user) {
          finalEmail = user.email; // OVERRIDE form email with account email
          console.log(`[Checkout] Linked order to user: ${finalEmail}`);
        }
      } catch (error) {
        console.log(error);
        console.log("Token invalid or user lookup failed, proceeding as guest.");
      }
    }
    // -------------------------------------------

    // 4. Calculate Product Total Securely
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

    // 5. Apply Coupon & Shipping
    let discount = 0;
    if (customerDetails.couponCode === "CHOCO10") {
      discount = productTotal * 0.10;
    }

    const amountAfterDiscount = productTotal - discount;
    let shipping = 0;
    
    if (productTotal > 0) {
      shipping = amountAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT;
    }

    const finalAmount = amountAfterDiscount + shipping;

    // 6. Create Order
    const newOrder = await Order.create({
      customerName: customerDetails.name,
      email: finalEmail, // <--- USES THE FORCED EMAIL
      address: customerDetails.address,
      totalAmount: Math.round(finalAmount), 
      status: 'Pending',
      isPaid: false,
      items: dbItems,
    });

    // 7. Generate Razorpay Order
    const amountInPaise = Math.round(finalAmount * 100);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise, 
      currency: 'INR',
      receipt: newOrder._id.toString(),
    });

    return NextResponse.json({
      orderId: newOrder._id,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: 'INR'
    });

  } catch (error: unknown) {
    console.error("Checkout Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}