import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/users";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function PUT(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return applyCorsHeaders(decoded);

    const { userId, addressId } = params;
    const { street, city, state, zip, country } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    if (!Array.isArray(user.addresses) || user.addresses.length === 0) {
      return applyCorsHeaders(
        NextResponse.json({ message: "No addresses found" }, { status: 404 })
      );
    }

    const addressIndex = user.addresses.findIndex(
      (addr) => addr._id.toString() === addressId
    );
    if (addressIndex === -1) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Address not found" }, { status: 404 })
      );
    }

    user.addresses[addressIndex] = {
      ...user.addresses[addressIndex],
      street,
      city,
      state,
      zip,
      country,
    };

    await user.save();

    return applyCorsHeaders(
      NextResponse.json(
        { message: "Address updated successfully", user },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Update Address Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return applyCorsHeaders(decoded);

    const { userId, addressId } = params;

    const user = await User.findById(userId);
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    if (!Array.isArray(user.addresses) || user.addresses.length === 0) {
      return applyCorsHeaders(
        NextResponse.json({ message: "No addresses found" }, { status: 404 })
      );
    }

    const updatedAddresses = user.addresses.filter(
      (addr) => addr._id.toString() !== addressId
    );

    if (updatedAddresses.length === user.addresses.length) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Address not found" }, { status: 404 })
      );
    }

    user.addresses = updatedAddresses;
    await user.save();

    return applyCorsHeaders(
      NextResponse.json(
        { message: "Address deleted successfully", user },
        { status: 200 }
      )
    );
  } catch (error) {
    console.error("Delete Address Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ CORS Preflight Support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
