import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    // Verify JWT Token
    const decoded = verifyAuth(req);
    if (decoded.status) return applyCorsHeaders(decoded);

    const { userId } = decoded;
    const { itemId } = params; // Correct usage, no need for `await`

    // Find the user's cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Cart not found" }, { status: 404 })
      );
    }

    // Remove the item from cart
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    if (cart.items.length === initialLength) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Item not found in cart" }, { status: 404 })
      );
    }

    await cart.save();

    return applyCorsHeaders(
      NextResponse.json({
        message: "Item removed from cart",
        status: 0,
        cart
      }, { status: 200 })
    );

  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Support CORS preflight request
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
