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

    const itemIndex = cart.items.findIndex(
      (item) =>
        item.products.toString() === productId &&
        item.productSize === productSize
    );

    if (itemIndex === -1) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Item not in cart" }, { status: 404 })
      );
    }

    const item = cart.items[itemIndex];

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items.splice(itemIndex, 1); // remove item from cart
    }

    await cart.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Cart updated successfully", status: 0 }, { status: 200 })
    );

  } catch (error) {
    console.error("Decrement Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ CORS preflight support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
