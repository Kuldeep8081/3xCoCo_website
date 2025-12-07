import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { sendEmail } from '@/lib/sendEmail'; // Ensure you have the email helper we discussed

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await connectDB();

    const user = await User.findOne({ email });

    // Security Note: Even if user is not found, we usually return "Success" 
    // to prevent hackers from checking which emails exist in your DB.
    if (!user) {
      return NextResponse.json({ message: "If that email exists, we sent a link." });
    }

    // 1. Generate Reset Token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // 2. Hash token for Database storage
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // 3. Set Expiration (10 Minutes)
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    // 4. Send Email (Log URL to console if no SMTP setup)
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password/${resetToken}`;
    const message = `You requested a password reset. Click here: ${resetUrl}`;

    try {
      await sendEmail(user.email, "Password Reset Request", message);
      return NextResponse.json({ message: "Email Sent" });
    } catch (err) {
      // If email fails, clear the token fields
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save();
      return NextResponse.json({ error: "Email could not be sent" }, { status: 500 });
    }

  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}