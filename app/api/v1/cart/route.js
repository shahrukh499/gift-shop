import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import Cart from "@/app/models/cart";
import Product from "@/app/models/products";

export async function POST(req) {
    try {
        await connectToDatabase();

        // Verify JWT Token
        const decoded = verifyAuth(req);
        if (decoded.status) return decoded; // Return error response if token is invalid

        const { userId } = decoded;
        const { products, productSize, quantity } = await req.json();

        if (!products || !quantity || quantity < 1) {
            return NextResponse.json({ message: "Invalid product or quantity" }, { status: 400 });
        }
        
        if(!productSize){
            return NextResponse.json({message: "Please select size"}, {status:400})
        }

        // Check if product exists
        const product = await Product.findById(products);
        if (!product) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        // Find or create cart for the user
        let cart = await Cart.findOne({ userId });
        if (!cart) {
            cart = new Cart({ userId, items: [] });
        }

        // Check if product already exists in cart
        const existingItem = cart.items.find((item) => item.products.toString() === products && item.productSize === productSize);
        if (existingItem) {
            existingItem.quantity += quantity; // Increase quantity
        } else {
            cart.items.push({ products, quantity, productSize }); // Add new item
        }

        await cart.save();

        return NextResponse.json({ message: "Item added to cart", status: 0, cart }, { status: 201 });

    } catch (error) {
        console.error("Add to Cart Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function GET(req) {
    try {
        await connectToDatabase();

        // Verify JWT Token
        const decoded = verifyAuth(req);
        if (decoded.status) return decoded; // Return error response if token is invalid

        const { userId } = decoded;

        // Find user's cart and populate product details
        const cart = await Cart.findOne({ userId }).populate("items.products");

        if (!cart) {
            return NextResponse.json({ message: "Cart is empty", cart: [] }, { status: 200 });
        }

        return NextResponse.json({ cart, status:0 }, { status: 200 });

    } catch (error) {
        console.error("Get Cart Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        await connectToDatabase();

        // Verify JWT Token
        const decoded = verifyAuth(req);
        if (decoded.status) return decoded; // Return error response if token is invalid

        const { userId } = decoded;

        // Find and delete cart
        await Cart.findOneAndDelete({ userId });

        return NextResponse.json({ message: "Cart cleared" }, { status: 200 });

    } catch (error) {
        console.error("Clear Cart Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

