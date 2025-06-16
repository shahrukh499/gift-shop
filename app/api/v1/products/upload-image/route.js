import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { applyCorsHeaders } from "@/app/api/_utils/cors";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get('file');

    if (!file) {
      return applyCorsHeaders(
        NextResponse.json({ message: "No file uploaded" }, { status: 400 })
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: "products" }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(buffer);
    });

    return applyCorsHeaders(
      NextResponse.json({
        message: "Image uploaded successfully",
        imageUrl: uploadResult.secure_url,
      }, { status: 200 })
    );

  } catch (error) {
    console.error("Image Upload Error:", error);
    return applyCorsHeaders(
      NextResponse.json({ message: "Server Error" }, { status: 500 })
    );
  }
}

// ✅ Support Preflight (OPTIONS) Request
export function OPTIONS() {
  return applyCorsHeaders(NextResponse.json({}, { status: 200 }));
}
