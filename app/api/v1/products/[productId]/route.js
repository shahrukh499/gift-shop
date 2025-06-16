import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Product from "@/app/models/products";
import { verifyAuth } from "@/app/lib/auth";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const { productId } = params;

    const product = await Product.findById(productId);

    if (!product) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Product not found" }, { status: 404 })
      );
    }

    return applyCorsHeaders(
      NextResponse.json({ product, status: 0 }, { status: 200 })
    );

  } catch (error) {
    console.error("Get Product Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return applyCorsHeaders(decoded);

    if (decoded.role !== "admin") {
      return applyCorsHeaders(
        NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 })
      );
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
      images,
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
      return applyCorsHeaders(
        NextResponse.json({ message: "Product not found" }, { status: 404 })
      );
    }

    return applyCorsHeaders(
      NextResponse.json({
        status: 0,
        message: "Product updated successfully",
        product: updatedProduct,
      }, { status: 200 })
    );
  } catch (error) {
    console.error("Update Product Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// DELETE a product by ID
export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return applyCorsHeaders(decoded);

    if (decoded.role !== "admin") {
      return applyCorsHeaders(
        NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 })
      );
    }

    const { productId } = params;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Product not found" }, { status: 404 })
      );
    }

    return applyCorsHeaders(
      NextResponse.json({ message: "Product deleted successfully", status: 0 }, { status: 200 })
    );
  } catch (error) {
    console.error("Delete Product Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Add CORS preflight support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}