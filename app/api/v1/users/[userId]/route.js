import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/users";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function GET(req, { params }) {
  try {
    await connectDB();

    const decoded = verifyAuth(req);
    if (decoded instanceof NextResponse) return applyCorsHeaders(decoded);

    const { userId } = params;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      return applyCorsHeaders(
        NextResponse.json({ message: "User not found" }, { status: 404 })
      );
    }

    return applyCorsHeaders(
      NextResponse.json({ user, status: 0 }, { status: 200 })
    );
  } catch (error) {
    console.error("Get User Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
