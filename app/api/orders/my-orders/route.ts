import { NextResponse } from 'next/server';
import { cookies } from 'next/headers'; // To read the secure cookie
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();

    // 1. Get the login token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    // 2. Decrypt the token to get the User's Email/ID
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // 3. Find orders where the 'email' matches the logged-in user's email
    // (We search by email because that's how we saved the order)
    const userOrders = await Order.find({ 
      // Assuming your User model and Order model both share the email
      // If you saved UserID in Order, use { userId: decoded.id }
      // Based on our previous steps, we rely on email:
      email: decoded.email || (await getUserEmail(decoded.id)) 
    }).sort({ createdAt: -1 });

    return NextResponse.json(userOrders);

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// Helper to get email if token only has ID (Optional safety net)
import User from '@/models/User';
async function getUserEmail(id: string) {
  const user = await User.findById(id);
  return user?.email;
}