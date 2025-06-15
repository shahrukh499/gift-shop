import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/users";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // Verify JWT Token
    const decoded = verifyAuth(req);
    if (decoded.status) return decoded; // Return error response if token is invalid

    const { userId } = params;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // ✅ Return addresses or empty array
    return NextResponse.json({ addresses: user.addresses || [] }, { status: 200 });

  } catch (error) {
    console.error("Get Addresses Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    await connectToDatabase();

    // Verify JWT Token
    const authResult = verifyAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = await params;
    const { street, city, state, zip, country } = await req.json();

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Initialize addresses array if it doesn't exist
    if (!user.addresses) {
      user.addresses = [];
    }

    // Add new address to user's addresses array
    const newAddress = { street, city, state, zip, country };
    user.addresses.push(newAddress);

    // Log the user object before saving
    /* console.log('User before save:', JSON.stringify(user, null, 2)); */

    try {
      const savedUser = await user.save();
      /* console.log('User after save:', JSON.stringify(savedUser, null, 2)); */

      return NextResponse.json({
        message: "Address added successfully",
        user: savedUser
      }, { status: 201 });
    } catch (saveError) {
      /* console.error('Save Error:', saveError); */
      return NextResponse.json({
        message: "Error saving address",
        error: saveError.message
      }, { status: 500 });
    }

  } catch (error) {
    /* console.error("Add Address Error:", error); */
    return NextResponse.json({
      message: "Server error",
      error: error.message
    }, { status: 500 });
  }
}