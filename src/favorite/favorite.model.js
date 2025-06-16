import { Schema, model } from "mongoose";

const FavoriteSchema = new Schema(
  {
    alias: {
      type: String,
      required: [true, "El alias es requerido"],
      trim: true,
    },
    cuenta: {
      type: Schema.Types.ObjectId,
      ref: "Account",
      required: [true, "La cuenta favorita es requerida"],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El propietario es requerido"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default model("Favorite", FavoriteSchema);
