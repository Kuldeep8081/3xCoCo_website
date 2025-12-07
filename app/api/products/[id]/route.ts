import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

// Define the correct Context type for Next.js 15
type RouteContext = {
  params: Promise<{ id: string }>;
};

// DELETE a specific product
export async function DELETE(
  req: Request,
  context: RouteContext // Fix: Use the Promise-based type
) {
  try {
    await connectDB();
    // Fix: Await the params promise
    const { id } = await context.params;
    
    const deletedProduct = await Product.findByIdAndDelete(id);
    
    if (!deletedProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

// GET specific product for editing
export async function GET(
  req: Request,
  context: RouteContext // Fix: Use the Promise-based type
) {
  try {
    await connectDB();
    // Fix: Await the params promise
    const { id } = await context.params;

    const product = await Product.findById(id);

    if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Fetch Error:", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

// PUT (Update) product
export async function PUT(
  req: Request, 
  context: RouteContext // Use the same consistent type
) {
  try {
    // Fix: Await the params promise
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
    console.error("Update Error:", error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}