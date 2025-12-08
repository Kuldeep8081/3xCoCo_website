import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import User from '@/models/User';
import { sendNotification } from '@/lib/notification'; // Import the helper

// 1. Define Request Body Interface
interface UpdateStatusBody {
  orderId: string;
  status: string;
}

export async function PATCH(req: Request) {
  try {
    // 2. Parse request
    const { orderId, status }: UpdateStatusBody = await req.json();
    
    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing ID or Status" }, { status: 400 });
    }

    await connectDB();

    // 3. Update the Order
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // --- 4. TRIGGER NOTIFICATION (The Missing Part) ---
    // Find the user associated with this order's email
    const user = await User.findOne({ email: updatedOrder.email });

    if (user) {
      console.log(`[Notify] Found user ${user.email}, sending alert...`);
      
      let message = "";
      let title = "Order Update 📦";

      if (status === "Shipped") {
        message = "Great news! Your chocolates have been shipped and are on the way. 🚚";
      } else if (status === "Delivered") {
        message = "Delivered! Your package has arrived. Enjoy your treat! 🍫";
        title = "Order Delivered ✅";
      }

      if (message) {
        // Send the push notification
        await sendNotification(
          user._id.toString(), 
          title, 
          message, 
          "/orders" // Clicking takes them to My Orders
        );
      }
    } else {
      console.log(`[Notify] No registered user found for email ${updatedOrder.email}`);
    }
    // --------------------------------------------------

    return NextResponse.json({ 
      message: "Status updated successfully", 
      order: updatedOrder 
    });

  } catch (error: unknown) {
    console.error("Update Status Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}