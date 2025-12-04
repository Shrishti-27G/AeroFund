import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

    // -----------------------------
    // LOGIN + AUTH FIELDS
    // -----------------------------

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

    // -----------------------------------
    // STATION BUDGET SUMMARY (read only)
    // -----------------------------------

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
  },
  { timestamps: true }
);

// ------------------------------------------
// PASSWORD HASHING BEFORE SAVE
// ------------------------------------------
stationSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ------------------------------------------
// COMPARE PASSWORD METHOD
// ------------------------------------------
stationSchema.methods.isPasswordCorrect = function (password) {
  return bcrypt.compare(password, this.password);
};

// ------------------------------------------
// GENERATE ACCESS TOKEN
// ------------------------------------------
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

// ------------------------------------------
// GENERATE REFRESH TOKEN
// ------------------------------------------
stationSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

export const Station = mongoose.model("Station", stationSchema);
