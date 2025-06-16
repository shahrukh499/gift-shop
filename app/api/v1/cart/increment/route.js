// @app/api/v1/cart/increment/route.js

import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId, productId, productSize } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Cart not found" }, { status: 404 })
      );
    }

    const item = cart.items.find(
      (item) =>
        item.products.toString() === productId &&
        item.productSize === productSize
    );

    if (!item) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Item not in cart" }, { status: 404 })
      );
    }

    item.quantity += 1;
    await cart.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Quantity increased", status: 0 }, { status: 200 })
    );
  } catch (error) {
    console.error("Increment Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Preflight CORS support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
