import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import Product from "@/app/models/products";

export async function GET(req) {
    try {
      await connectToDatabase();
  
      const { search, category, subcategory, brand, minPrice, maxPrice } = Object.fromEntries(new URL(req.url).searchParams);
  
      let query = {};
  
      if (search) {
        query.name = { $regex: search, $options: "i" }; // Case-insensitive search
      }

      // 🏷️ Filter by category
      if (category) query.category = category;

      // 📂 Filter by subcategory (male, female, kids)
      if (subcategory) query.subcategory = subcategory;

      // 🏭 Filter by brand
      if (brand) query.brand = brand;

      // 💲 Filter by price range
      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }
  
      const products = await Product.find(query);
  
      return NextResponse.json({ products, count: products.length, status:0 }, { status: 200 });
  
    } catch (error) {
      console.error("Get Products Error:", error);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }
  

  export async function POST(req) {
    try {
      await connectToDatabase();
  
      const decoded = verifyAuth(req);
      if (decoded.status) return decoded;
  
      if (decoded.role !== "admin") {
        return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 403 });
      }
  
      const { name, price, discount, category, subcategory, brand, description, stock, images, sizes } = await req.json();
  
      if (!name || !price || !category || !subcategory || !brand || !stock || !sizes ) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
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
        images, // Save imageUrl inside array
        sizes
      });
  
      await newProduct.save();
  
      return NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 });
  
    } catch (error) {
      console.error("Add Product Error:", error);
      return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
  }
