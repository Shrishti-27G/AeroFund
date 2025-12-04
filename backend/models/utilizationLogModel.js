import mongoose, { Schema } from "mongoose";

const utilizationLogSchema = new Schema(
  {
    allocationId: {
      type: Schema.Types.ObjectId,
      ref: "Allocation",
      required: true,
    },

    previousAmount: Number,
    newAmount: Number,

    changedBy: {
      type: Schema.Types.ObjectId,
      ref: "Supervisor",
    },

    remarks: {
      type: String,
      trim: true,
    },

    changeDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const UtilizationLog = mongoose.model(
  "UtilizationLog",
  utilizationLogSchema
);
