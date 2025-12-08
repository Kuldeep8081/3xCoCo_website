import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';

// GET: Fetch my notifications
export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json([]);

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    
    // Fetch last 20 notifications
    const notifications = await Notification.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return NextResponse.json(notifications);
  } catch (error) {
    return NextResponse.json([]);
  }
}

// PATCH: Mark all as read
export async function PATCH() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await Notification.updateMany(
      { userId: decoded.id, isRead: false },
      { isRead: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}