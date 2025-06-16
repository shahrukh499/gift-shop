import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/users";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectToDatabase();

    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Token and new password are required." }, { status: 400 })
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Reset password link is expired." }, { status: 401 })
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found." }, { status: 404 })
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Password reset successful.", status: 0 }, { status: 200 })
    );

  } catch (error) {
    console.error("Reset Password Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error." }, { status: 500 })
    );
  }
}

// ✅ Preflight request handler
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
