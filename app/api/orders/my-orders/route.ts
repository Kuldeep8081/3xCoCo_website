import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

// 1. Define the shape of your Token
interface DecodedToken extends JwtPayload {
  id: string;
  role?: string;
}

export async function GET() {
  try {
    await connectDB();
    
    // 2. Get the Login Token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Verify Token and cast to our Interface
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error("JWT_SECRET is not defined");
    }

    const decoded = jwt.verify(token, secret) as DecodedToken;

    // 4. Find the User to get their exact Email
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 5. FILTER: Find orders that match THIS user's email
    const myOrders = await Order.find({ email: user.email }) 
      .populate({
        path: 'items.productId',
        model: Product,
        select: 'name image price'
      })
      .sort({ createdAt: -1 });

    return NextResponse.json(myOrders);

  } catch (error: unknown) {
    // 6. Type-safe Error Handling
    console.error("My Orders API Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch orders";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}