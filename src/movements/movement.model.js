import { Schema, model } from "mongoose";

const MovementSchema = new Schema(
  {
    amount: {
      type: Number,
      required: [true, "El monto es requerido"],
      min: [0.01, "El monto debe ser mayor que cero"],
    },
    fromAccount: {
      type: String,
      required: [true, "Número de cuenta emisor requerido"],
      trim: true,
    },
    toAccount: {
      type: String,
      required: [true, "Número de cuenta receptor requerido"],
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxLength: 100,
    },
    saldoPosterior: {
      type: Number,
      required: [true, "El saldo posterior es requerido"],
      min: [0, "El saldo no puede ser negativo"],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Usuario que realizó el movimiento requerido"],
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Movement", MovementSchema);
