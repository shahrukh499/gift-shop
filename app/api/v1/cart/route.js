import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";
import Product from "@/app/models/products";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function POST(req) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded.status) return applyCorsHeaders(decoded);

    const { userId } = decoded;
    const { products, productSize, quantity } = await req.json();

    if (!products || !quantity || quantity < 1) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Invalid product or quantity" }, { status: 400 })
      );
    }

    if (!productSize) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Please select size" }, { status: 400 })
      );
    }

    const product = await Product.findById(products);
    if (!product) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Product not found" }, { status: 404 })
      );
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      (item) => item.products.toString() === products && item.productSize === productSize
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ products, quantity, productSize });
    }

    await cart.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Item added to cart", status: 0, cart }, { status: 201 })
    );

  } catch (error) {
    console.error("Add to Cart Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded.status) return applyCorsHeaders(decoded);

    const { userId } = decoded;

    const cart = await Cart.findOne({ userId }).populate("items.products");

    if (!cart) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Cart is empty", cart: [] }, { status: 200 })
      );
    }

    return applyCorsHeaders(
      NextResponse.json({ cart, status: 0 }, { status: 200 })
    );

  } catch (error) {
    console.error("Get Cart Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

export async function DELETE(req) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded.status) return applyCorsHeaders(decoded);

    const { userId } = decoded;

    await Cart.findOneAndDelete({ userId });

    return applyCorsHeaders(
      NextResponse.json({ message: "Cart cleared" }, { status: 200 })
    );

  } catch (error) {
    console.error("Clear Cart Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Preflight CORS support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
