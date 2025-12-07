// app/api/seed/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export const runtime = "nodejs";

export async function GET() {
  try {
    await connectDB();
    console.log("[SEED] Connected to MongoDB");

    // Clear previous data
    const delResult = await Product.deleteMany({});
    console.log("[SEED] Deleted products:", delResult.deletedCount);

    // Insert all your chocolates here

    const docs = await Product.insertMany([
      {
        name: "Hazelnut Heaven",
        description: "Roasted hazelnuts coated in 45% milk chocolate.",
        price: 499,
        image:
          "https://res.cloudinary.com/dfpirhp3d/image/upload/v1765109212/cal2_qmify3.png",
        category: "Milk",
      },
      {
        name: "Dark Truffle Supreme",
        description: "80% Dark Chocolate ganache dusted with cocoa.",
        price: 599,
        image:
          "https://res.cloudinary.com/dfpirhp3d/image/upload/v1765109208/cat1_ed6iac.png",
        category: "Dark",
      },
      {
        name: "White Berry Bliss",
        description: "Creamy white chocolate with dried strawberries.",
        price: 450,
        image:
          "https://res.cloudinary.com/dfpirhp3d/image/upload/v1765109205/cal1_tyaw5o.png",
        category: "White",
      },
      // 👇 your 2 new items
      {
        name: "Caramel Sea Salt Crunch",
        description: "Milk chocolate with caramel and a hint of sea salt.",
        price: 520,
        image:
          "https://res.cloudinary.com/dfpirhp3d/image/upload/v1765109181/cat3_bh1ufk.png",
        category: "Milk",
      },
      {
        name: "Almond Dark Bark",
        description: "70% dark chocolate topped with roasted almonds.",
        price: 560,
        image:
          "https://res.cloudinary.com/dfpirhp3d/image/upload/v1765109168/cat2_yynaei.png",
        category: "Dark",
      },
      {
        name: "Almond Dark Bark",
        description: "70% dark chocolate topped with roasted almonds.",
        price: 560,
        image:
          "https://res.cloudinary.com/dfpirhp3d/image/upload/v1765109064/cal3_gtiyos.png",
        category: "Dark",
      },
    ]);

    console.log("[SEED] Inserted products:", docs.length);

    return NextResponse.json({
      message: "Database seeded with chocolate!",
      count: docs.length,
    });
  } catch (err) {
    console.error("[SEED ERROR]", err);
    return NextResponse.json(
      { error: "Failed to seed database", details: String(err) },
      { status: 500 }
    );
  }
}
