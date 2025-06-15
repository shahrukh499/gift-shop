import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectDB from "@/app/lib/mongodb";
import User from "@/app/models/users";

export async function GET(req, { params }) {
  try {
    await connectDB();

    // Verify JWT Token
    const authResult = verifyAuth(req);
    if (authResult instanceof NextResponse) return authResult;

    const { userId } = await params;

    // Find user by ID and exclude password
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    /* console.error("Get User Error:", error); */
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
