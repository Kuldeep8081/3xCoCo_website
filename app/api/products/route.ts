import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';

// Define the Context Type specifically for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

// 1. GET: Fetch a single product
export async function GET(req: Request, context: RouteContext) {
  try {
    await connectDB();
    
    // Await the params from the context
    const { id } = await context.params;
    
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch product error:", error);
    return NextResponse.json({ error: "Fetch failed" }, { status: 500 });
  }
}

// 2. PUT: Update a product
export async function PUT(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    await connectDB();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { 
      new: true, 
      runValidators: true 
    });

    if (!updatedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}

// 3. DELETE: Remove a product
export async function DELETE(req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}