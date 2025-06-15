import { NextResponse } from "next/server";
import { verifyAuth } from "@/app/lib/auth";
import connectToDatabase from "@/app/lib/mongodb";
import User from "@/app/models/users";

export async function PUT(req, { params }) {
    try {
        await connectToDatabase();

        // Verify JWT Token
        const decoded = verifyAuth(req);
        if (decoded.status) return decoded; // Return error response if token is invalid

        const { userId, addressId } = params;
        const { street, city, state, zip, country } = await req.json();

        // Find user by ID
        let user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // ✅ Ensure user has addresses
        if (!Array.isArray(user.addresses) || user.addresses.length === 0) {
            return NextResponse.json({ message: "No addresses found" }, { status: 404 });
        }

        // ✅ Find the address to update
        let addressIndex = user.addresses.findIndex((addr) => addr._id.toString() === addressId);
        if (addressIndex === -1) {
            return NextResponse.json({ message: "Address not found" }, { status: 404 });
        }

        // ✅ Update the address
        user.addresses[addressIndex] = { ...user.addresses[addressIndex], street, city, state, zip, country };

        // ✅ Save changes
        await user.save();

        return NextResponse.json({ message: "Address updated successfully", user }, { status: 200 });

    } catch (error) {
        console.error("Update Address Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

export async function DELETE(req, { params }) {
    try {
        await connectToDatabase();

        // Verify JWT Token
        const decoded = verifyAuth(req);
        if (decoded.status) return decoded; // Return error response if token is invalid

        const { userId, addressId } = params;

        // Find user by ID
        let user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // ✅ Check if user has addresses
        if (!Array.isArray(user.addresses) || user.addresses.length === 0) {
            return NextResponse.json({ message: "No addresses found" }, { status: 404 });
        }

        // ✅ Remove address from array
        const updatedAddresses = user.addresses.filter((addr) => addr._id.toString() !== addressId);

        // ✅ Check if address existed
        if (updatedAddresses.length === user.addresses.length) {
            return NextResponse.json({ message: "Address not found" }, { status: 404 });
        }

        // ✅ Update user document
        user.addresses = updatedAddresses;
        await user.save();

        return NextResponse.json({ message: "Address deleted successfully", user }, { status: 200 });

    } catch (error) {
        console.error("Delete Address Error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}
