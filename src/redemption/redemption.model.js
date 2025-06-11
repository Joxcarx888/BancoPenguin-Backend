import { Schema, model } from "mongoose";

const RedemptionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    prize: {
      type: Schema.Types.ObjectId,
      ref: "Prize",
      required: true,
    },
    pointsUsed: {
      type: Number,
      required: true,
      min: [1, "Se deben usar al menos 1 punto para el canje"],
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "canceled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Redemption", RedemptionSchema);
