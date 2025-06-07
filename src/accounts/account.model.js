import { Schema, model } from "mongoose";
import crypto from "crypto";

const AccountSchema = new Schema(
  {
    numeroCuenta: {
      type: String,
      default: () => crypto.randomBytes(6).toString("hex"),
      unique: true,
    },
    tipoCuenta: {
      type: String,
      enum: ["AHORRO", "MONETARIA"],
      required: [true, "El tipo de cuenta es requerido"],
    },
    saldo: {
      type: Number,
      default: 0,
      min: [0, "El saldo no puede ser negativo"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    state: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);


export default model("Account", AccountSchema);
