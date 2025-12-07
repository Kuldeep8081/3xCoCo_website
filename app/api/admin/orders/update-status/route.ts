import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';

// 1. Define Request Body Interface
interface UpdateStatusBody {
  orderId: string;
  status: string;
}

export async function PATCH(req: Request) {
  try {
    // 2. Parse request with strict typing
    const { orderId, status }: UpdateStatusBody = await req.json();
    
    // 3. Validation
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    await connectDB();

    // 4. Update the Order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      message: "Status updated successfully", 
      order: updatedOrder 
    });

  } catch (error: unknown) {
    // 5. Strict Error Handling (No 'any')
    console.error("Update Status Error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "Update failed";
    
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}