import mongoose from "mongoose";

const prizeSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    precioPuntos: {
      type: Number,
      required: true,
      min: 0,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Prize", prizeSchema);
