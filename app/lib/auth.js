import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
const JWT_SECRET = process.env.JWT_SECRET; // Make sure this is set in your .env file

export function verifyAuth(req) {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: No token provided" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
    }

    return decoded; // Ensure this contains `role`
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return NextResponse.json({ message: "Unauthorized: Invalid token" }, { status: 401 });
  }
}

