import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/users";
import jwt from "jsonwebtoken";
import { sendResetEmail } from "@/app/lib/mailer";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Email is required" }, { status: 400 })
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    await sendResetEmail(user.email, resetLink);

    return applyCorsHeaders(
      NextResponse.json({ message: "Reset link sent to email", status: 0 }, { status: 200 })
    );

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Preflight support
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
