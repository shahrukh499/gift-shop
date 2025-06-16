import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import Product from "@/app/models/products";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { search, category, subcategory, brand, minPrice, maxPrice } = Object.fromEntries(
      new URL(req.url).searchParams
    );

    let query = {};

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (brand) query.brand = brand;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query);

    const res = NextResponse.json({ products, count: products.length, status: 0 }, { status: 200 });
    return applyCorsHeaders(res);

  } catch (error) {
    console.error("Get Products Error:", error);
    const res = NextResponse.json({ message: "Server error" }, { status: 500 });
    return applyCorsHeaders(res);
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded.status) return decoded;

    if (decoded.role !== "admin") {
      return applyCorsHeaders(
        NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 })
      );
    }

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
      sizes,
    } = await req.json();

    if (!name || !price || !category || !subcategory || !brand || !stock || !sizes) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Missing required fields" }, { status: 400 })
      );
    }

    const newProduct = new Product({
      name,
      price,
      discount,
      category,
      subcategory,
      brand,
      description,
      stock,
      images,
      sizes,
    });

    await newProduct.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 })
    );

  } catch (error) {
    console.error("Add Product Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Support preflight OPTIONS request
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
