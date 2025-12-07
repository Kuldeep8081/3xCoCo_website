import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers'; // Next.js Cookie Helper
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectDB();

    // 1. Find User
    const user = await User.findOne({ email });
    if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    // 2. Check Password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return NextResponse.json({ error: "Invalid credentials" }, { status: 400 });

    // 3. Create Token
    const token = jwt.sign(
      { id: user._id, role: user.role }, 
      process.env.JWT_SECRET!, 
      { expiresIn: '1d' }
    );

    // 4. Set Cookie
    const response = NextResponse.json({ 
      message: "Login successful",
      user: { name: user.name, email: user.email, role: user.role } 
    });

    response.cookies.set("token", token, {
      httpOnly: true, // Javascript cannot read this (Security)
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 Day
      path: "/",
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}