import mongoose, { Schema } from "mongoose";

const allocationSchema = new Schema(
  {
    stationId: {
      type: Schema.Types.ObjectId,
      ref: "Station",
      required: true,
    },

    supervisorId: {
      type: Schema.Types.ObjectId,
      ref: "Supervisor",
      required: true,
    },

    entryDate: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    allocationType: {
      type: String,
      enum: ["Token", "Full", "Final"],
      required: true,
    },

    allocatedAmount: {
      type: Number,
      required: true,
    },

    estimatedAmount: {
      type: Number,
      required: true,
    },

    utilizedAmount: {
      type: Number,
      default: 0,
    },

    utilizedStatus: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      trim: true,
    },

    receiptUrl: {
      type: String,
      default: null,
    },

    receiptUploaded: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const Allocation = mongoose.model("Allocation", allocationSchema);
