import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';

export async function GET() {
  await connectDB();

  // REPLACE THIS WITH THE EMAIL YOU REGISTERED WITH
  const targetEmail = "kuldeep15072003kumar@gmail.com"; 

  const user = await User.findOneAndUpdate(
    { email: targetEmail },
    { role: "admin" },
    { new: true }
  );

  if (!user) {
    return NextResponse.json({ error: "User not found. Register first!" });
  }

  return NextResponse.json({ 
    message: "Success! User is now an Admin.", 
    user: { name: user.name, email: user.email, role: user.role } 
  });
}