import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/users";
import connectToDatabase from "@/app/lib/mongodb";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function POST(req) {
  try {
    await connectToDatabase();

    const { email, password } = await req.json();

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
      );
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Invalid email or password" }, { status: 401 })
      );
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return applyCorsHeaders(
      NextResponse.json({
        message: "Login successful",
        status: 0,
        token,
        username: user.name,
      }, { status: 200 })
    );

  } catch (error) {
    console.error("Login Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Handle Preflight OPTIONS Request
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
// This function is used to handle CORS preflight requests
// and should return a response with appropriate headers.
