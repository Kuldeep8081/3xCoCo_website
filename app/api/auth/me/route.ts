import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt, { JwtPayload } from 'jsonwebtoken';
import connectDB from '@/lib/db';
import User from '@/models/User';

// 1. Define the shape of your Token Payload
interface DecodedToken extends JwtPayload {
  id: string;
  email?: string;
  role?: string;
}

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not defined in environment variables");
    }

    // 2. Verify and cast to our Interface
    const decoded = jwt.verify(token, secret) as DecodedToken;
    
    // 3. Fetch User
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error: unknown) {
    // 4. Strict Error Handling
    console.error("Auth Me Error:", error);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
  }
}