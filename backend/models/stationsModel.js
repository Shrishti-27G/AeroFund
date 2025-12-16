import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Year-wise budget schema
const yearlyBudgetSchema = new Schema(
  {
    year: {
      type: Number,
      required: true, // Example: 2024, 2025
    },

    totalAllocated: {
      type: Number,
      default: 0,
    },

    totalUtilized: {
      type: Number,
      default: 0,
    },

    totalEstimated: {
      type: Number,
      default: 0,
    },

    remark: {
      type: String,
      default: "N/A",
    },

    receipts: [
      {
        type: String
      }
    ],

    allocationType: {
      type: String,
    },

    description: {
      type: String,
      trim: true,
      default: "", // Optional by default
      maxlength: 500, // ✅ Optional safety limit
    },

  },
  { _id: false } // ✅ Prevent separate _id for yearly objects
);

const stationSchema = new Schema(
  {
    stationName: {
      type: String,
      required: true,
      trim: true,
    },

    stationCode: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    email: {
      type: String,
      unique: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },

    password: {
      type: String,
      required: true,
    },

    accessToken: {
      type: String,
      default: null,
    },

    refreshToken: {
      type: String,
      default: null,
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true,
    },

    // ✅ ✅ YEAR-WISE STORAGE
    yearlyData: [yearlyBudgetSchema],
  },
  { timestamps: true }
);

// ✅ PASSWORD HASHING
stationSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

// ✅ COMPARE PASSWORD
stationSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

// ✅ ACCESS TOKEN
stationSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      stationName: this.stationName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// ✅ REFRESH TOKEN
stationSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Station = mongoose.model("Station", stationSchema);
