import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/users";
import { applyCorsHeaders } from "@/app/api/_utils/cors"; // Create this helper or inline it if needed

// Handle CORS Preflight
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}

// GET all addresses for a user
export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return decoded;

    const { userId } = params;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return applyCorsHeaders(
      NextResponse.json({ addresses: user.addresses || [] }, { status: 200 })
    );
  } catch (error) {
    console.error("Get Addresses Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// POST a new address for a user
export async function POST(req, { params }) {
  try {
    await connectToDatabase();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return decoded;

    const { userId } = params;
    const { street, city, state, zip, country } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    const newAddress = { street, city, state, zip, country };
    user.addresses = user.addresses || [];
    user.addresses.push(newAddress);

    const savedUser = await user.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Address added successfully", user: savedUser }, { status: 201 })
    );
  } catch (error) {
    console.error("Add Address Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error", error: error.message }, { status: 500 })
    );
  }
}
