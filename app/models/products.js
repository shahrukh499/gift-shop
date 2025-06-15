import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    price: {
      type: Number,
      required: true
    },
    discount: {
      type: Number,
    },
    category: {
      type: String,
      required: true
    },
    subcategory: {
      type: String,
      enum: ["men", "women", "kids", "boy", "girl"], // Allowed subcategories
      required: true
    },
    brand: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ""
    },
    stock: {
      type: Number,
      required: true,
      min: 0
    },
    images: {
      type: [String], // Array of image URLs
      default: []
    },
    sizes: [
      {
        label: {type: String, required: true},
        available: {type: Boolean, default: true}
      }
    ]
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
export default Product;
