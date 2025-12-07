import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query');

    if (!query) return NextResponse.json([]);

    await connectDB();

    // Search for products where name matches the query (Case insensitive)
    // Limit to 5 results for the dropdown
    const products = await Product.find({
      name: { $regex: query, $options: 'i' }
    }).limit(5).select('name image price category createdAt');

    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}