import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    year: {
      type: String,
      required: true,
      unique: true,
    },

    totalBudget: {
      type: Number,
      required: true,
    },

    totalAllocated: {
      type: Number,
      default: 0,
    },

    totalUtilized: {
      type: Number,
      default: 0,
    },

    utilizationPercent: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Budget = mongoose.model("Budget", budgetSchema);
