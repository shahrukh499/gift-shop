import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Coupon from "@/app/models/coupons";
import Cart from "@/app/models/cart";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { code, cartTotal, userId } = await req.json();

    if (!code || !cartTotal || !userId) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Missing data" }, { status: 400 })
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Coupon not found" }, { status: 404 })
      );
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Coupon has expired" }, { status: 400 })
      );
    }

    if (cartTotal < coupon.minOrderAmount) {
      return applyCorsHeaders(
        NextResponse.json({
          message: `Minimum order amount is ₹${coupon.minOrderAmount}`
        }, { status: 400 })
      );
    }

    const cart = await Cart.findOne({ userId }).populate("items.products");

    const cartItems = cart.items.map(item => ({
      brand: item.products.brand,
      category: item.products.category
    }));

    const matchesBrand = coupon.applicableBrands?.length
      ? cartItems.some(item => coupon.applicableBrands.includes(item.brand))
      : true;

    const matchesCategory = coupon.applicableCategories?.length
      ? cartItems.some(item => coupon.applicableCategories.includes(item.category))
      : true;

    if (!matchesBrand && !matchesCategory) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Coupon not applicable to these items" }, { status: 400 })
      );
    }

    const userUsage = coupon.usedBy?.find(entry => entry.userId.toString() === userId);
    const usageLimit = coupon.usageLimit || 1;

    if (userUsage && userUsage.count >= usageLimit) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 })
      );
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    const couponToUpdate = await Coupon.findById(coupon._id);
    couponToUpdate.usedBy = couponToUpdate.usedBy || [];

    const usageIndex = couponToUpdate.usedBy.findIndex(
      entry => entry.userId.toString() === userId
    );

    if (usageIndex > -1) {
      couponToUpdate.usedBy[usageIndex].count += 1;
    } else {
      couponToUpdate.usedBy.push({ userId, count: 1 });
    }

    await couponToUpdate.save();

    return applyCorsHeaders(
      NextResponse.json({
        message: "Coupon applied successfully",
        discount,
        finalAmount: cartTotal - discount,
        status: 0
      }, { status: 200 })
    );

  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ OPTIONS method for CORS preflight
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
