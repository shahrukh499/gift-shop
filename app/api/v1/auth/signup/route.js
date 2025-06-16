import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/app/models/users";
import connectToDatabase from "@/app/lib/mongodb";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

export async function POST(req) {
  try {
    await connectToDatabase();
    
    const { name, email, password, role } = await req.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return applyCorsHeaders(
        NextResponse.json({ message: "Email already exists" }, { status: 400 })
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return applyCorsHeaders(
      NextResponse.json({
        message: "User registered successfully",
        token,
        status: 0,
        username: newUser.name
      }, { status: 201 })
    );

  } catch (error) {
    console.error("Signup Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server error" }, { status: 500 })
    );
  }
}

// ✅ Support preflight CORS request
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
// This function is used to handle CORS preflight requests
// and should return a response with appropriate headers.