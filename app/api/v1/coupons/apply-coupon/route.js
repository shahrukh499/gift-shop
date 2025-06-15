import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import Coupon from "@/app/models/coupons";
import Cart from "@/app/models/cart";

export async function POST(req) {
  try {
    await connectToDatabase();
    const { code, cartTotal, userId } = await req.json();

    if (!code || !cartTotal || !userId) {
      return NextResponse.json({ message: "Missing data" }, { status: 400 });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return NextResponse.json({ message: "Coupon not found" }, { status: 404 });
    }

    if (new Date(coupon.expiresAt) < new Date()) {
      return NextResponse.json({ message: "Coupon has expired" }, { status: 400 });
    }

    if (cartTotal < coupon.minOrderAmount) {
      return NextResponse.json({
        message: `Minimum order amount is ₹${coupon.minOrderAmount}`
      }, { status: 400 });
    }

    const cart = await Cart.findOne({ userId }).populate('items.products');

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
      return NextResponse.json({ message: "Coupon not applicable to these items" }, { status: 400 });
    }

    // 🔐 Check per-user usage limit
    const userUsage = coupon.usedBy?.find(entry => entry.userId.toString() === userId);
    const usageLimit = coupon.usageLimit || 1;

    if (userUsage && userUsage.count >= usageLimit) {
      return NextResponse.json({ message: "Coupon usage limit reached" }, { status: 400 });
    }

    // 💸 Calculate discount
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (cartTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === "flat") {
      discount = coupon.discountValue;
    }

    // 💾 OPTIONAL: Update coupon usage here (or during order placement)
    // Comment out this block if you only want to increase usage on actual checkout
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

    return NextResponse.json({
      message: "Coupon applied successfully",
      discount,
      finalAmount: cartTotal - discount,
      status: 0
    }, { status: 200 });

  } catch (error) {
    console.error("Apply Coupon Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
