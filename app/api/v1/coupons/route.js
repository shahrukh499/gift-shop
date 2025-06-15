import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Coupon from "@/app/models/coupons";
import { verifyAuth } from "@/app/lib/auth";

export async function GET() {
  try {
    await connectToDatabase();

    // Get all valid coupons (not expired and under usage limit)
    const now = new Date();
    const coupons = await Coupon.find({
      expiresAt: { $gte: now },
      $expr: { $lt: ["$usedCount", "$usageLimit"] },
    });

    return NextResponse.json({ coupons, status: 0 }, { status: 200 });
  } catch (error) {
    console.error("Get Coupons Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    // Verify JWT Token
    const decoded = verifyAuth(req);
    if (decoded.status) return decoded; // Return error response if token is invalid

    // Check if user is an admin
    if (decoded.role !== "admin") {
      return NextResponse.json(
        { message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const body = await req.json();

    const {
      code,
      discountType,
      description,
      discountValue,
      minOrderAmount,
      expiresAt,
      applicableCategories = [],
      applicableBrands = [],
      usageLimit = 1,
    } = body;

    // Basic validations
    if (!code || !discountType || !discountValue || !expiresAt) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    // Check if coupon code already exists
    const existing = await Coupon.findOne({ code });
    if (existing) {
      return NextResponse.json(
        { message: "Coupon code already exists." },
        { status: 409 }
      );
    }

    const newCoupon = new Coupon({
      code: code.toUpperCase(),
      discountType,
      description,
      discountValue,
      minOrderAmount,
      expiresAt: new Date(expiresAt),
      applicableCategories,
      applicableBrands,
      usageLimit,
    });

    await newCoupon.save();

    return NextResponse.json(
      { message: "Coupon created successfully.", status:0 },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Coupon Error:", error);
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}
