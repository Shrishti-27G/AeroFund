import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    station: {
      type: String,
      default: null, // Only required when the role is "station"
    },
    role: {
      type: String,
      enum: ["admin", "station"],
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate email registration
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt automatically
);

export default mongoose.model("User", userSchema);
