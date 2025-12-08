import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Subscription from '@/models/Subscription';

export async function POST(req: Request) {
  try {
    const subscription = await req.json();
    await connectDB();

    // Get Logged in User ID
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    // Save/Update Subscription
    await Subscription.findOneAndUpdate(
      { endpoint: subscription.endpoint },
      { 
        userId: decoded.id,
        endpoint: subscription.endpoint,
        keys: subscription.keys 
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ message: "Subscribed!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}