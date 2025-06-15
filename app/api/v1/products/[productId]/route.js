import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Product from "@/app/models/products";
import { verifyAuth } from "@/app/lib/auth";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { productId } = await params;

    // Find product by ID
    const product = await Product.findById(productId);
    
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product, status:0 }, { status: 200 });

  } catch (error) {
    console.error("Get Product Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded.status) return decoded;

    if (decoded.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
    }

    const { productId } = params;
    const body = await req.json();
    const {
      name,
      price,
      discount,
      category,
      subcategory,
      brand,
      description,
      stock,
      images, // array of image URLs
    } = body;

    const updateFields = {};

    if (name) updateFields.name = name;
    if (price) updateFields.price = price;
    if (discount) updateFields.discount = discount;
    if (category) updateFields.category = category;
    if (subcategory) updateFields.subcategory = subcategory;
    if (brand) updateFields.brand = brand;
    if (description) updateFields.description = description;
    if (stock) updateFields.stock = stock;
    if (images && Array.isArray(images)) updateFields.images = images;

    const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      status:0,
      message: "Product updated successfully",
      product: updatedProduct,
    }, { status: 200});
  } catch (error) {
    console.error("Update Product Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}