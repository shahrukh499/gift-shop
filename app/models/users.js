import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  street: String,
  city: String,
  state: String,
  zip: String,
  country: String,
}, { _id: false });


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "customer" },
  createdAt: { type: Date, default: Date.now },
  addresses: { type: [AddressSchema], default: [] }, // ✅ Ensure it's an array
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
