// @app/api/v1/cart/increment/route.js

import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { userId, productId, productSize } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) return NextResponse.json({ message: "Cart not found" }, { status: 404 });

    const item = cart.items.find((item) => item.products.toString() === productId && item.productSize === productSize);
    if (!item) return NextResponse.json({ message: "Item not in cart" }, { status: 404 });

    item.quantity += 1;
    await cart.save();

    return NextResponse.json({ message: "Quantity increased", status:0 }, { status: 200 });
  } catch (error) {
    console.error("Increment Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
