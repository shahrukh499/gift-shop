import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    // Verify JWT Token
    const decoded = verifyAuth(req);
    if (decoded.status) return decoded; // Return error response if token is invalid

    const { userId } = decoded;
    const { itemId } = await params; // Extract cart item ID from URL

    // Find the user's cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ message: "Cart not found" }, { status: 404 });
    }

    // Remove the item from cart by filtering it out
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);

    // If no change, it means the item was not found in the cart
    if (cart.items.length === initialLength) {
      return NextResponse.json({ message: "Item not found in cart" }, { status: 404 });
    }

    // Save the updated cart
    await cart.save();

    return NextResponse.json({ message: "Item removed from cart", status:0, cart }, { status: 200 });

  } catch (error) {
    console.error("Remove Cart Item Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
