import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountType: {
    type: String, // "percentage" or "flat"
    enum: ["percentage", "flat"],
    required: true
  },
  description: {
    type: String,
    default: ""
  },
  discountValue: {
    type: Number,
    required: true
  },
  minOrderAmount: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  applicableCategories: {
    type: [String],
    default: []
  },
  applicableBrands: {
    type: [String],
    default: []
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  usedBy: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    count: { type: Number, default: 0 }
  }]
}, { timestamps: true });

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
export default Coupon;
