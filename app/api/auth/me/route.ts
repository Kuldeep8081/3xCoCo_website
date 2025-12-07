import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import connectDB from "@/lib/db";
import User from "@/models/User";

// Optional but recommended if using jsonwebtoken
export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();

    // ✅ cookies() returns a Promise in your setup, so await it
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "No token" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Auth /me error:", error);
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
