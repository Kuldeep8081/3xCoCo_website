import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// GET: List all chocolates (Public)
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({});
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

// POST: Add a new chocolate (Admin Only)
export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Basic validation
    if (!body.name || !body.price || !body.image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newProduct = await Product.create({
      name: body.name,
      description: body.description,
      price: body.price,
      image: body.image,
      category: body.category || 'Standard',
      stock: body.stock || 10
    });

    return NextResponse.json({ message: "Product Created", product: newProduct }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}