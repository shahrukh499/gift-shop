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

    const { token, currentPassword, newPassword } = await req.json();

    if (!token || !currentPassword || !newPassword) {
      return applyCorsHeaders(
        NextResponse.json(
          { message: "Token, current password, and new password are required." },
          { status: 400 }
        )
      );
    }

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Invalid or expired token." }, { status: 401 })
      );
    }

    // Find user by ID
    const user = await User.findById(decoded.userId);
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found." }, { status: 404 })
      );
    }

    // Check current password
    const isPasswordCorrect = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordCorrect) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Current password is incorrect." }, { status: 401 })
      );
    }

    // Ensure new password is different
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return applyCorsHeaders(
        NextResponse.json(
          { message: "New password must be different from the current password." },
          { status: 400 }
        )
      );
    }

    // Update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return applyCorsHeaders(
      NextResponse.json({ message: "Password reset successful." }, { status: 200 })
    );

  } catch (error) {
    console.error("Change Password Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error." }, { status: 500 })
    );
  }
}

// ✅ CORS Preflight Support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
