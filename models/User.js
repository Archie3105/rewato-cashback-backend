// models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  password: { type: String }, // store hashed password in real app
  createdAt: { type: Date, default: Date.now },
  cashbackEligible: { type: Boolean, default: false }, // you can flip this for cashback rules
  cashbackTotal: { type: Number, default: 0 }, // aggregated cashback for user
});

export default mongoose.model("User", userSchema);
