import { Schema, model } from "mongoose";
import crypto from "crypto";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Nombre es requerido"],
      maxLength: [35, "No puede exceder los 35 caracteres"],
      trim: true,
    },
    username: {
      type: String,
      unique: true,
      required: [true, "Username es requerido"],
      trim: true,
    },
    noCuenta: {
      type: String,
      default: () => crypto.randomBytes(6).toString("hex"),
      unique: true,
    },
    dpi: {
      type: String,
      required: [true, "DPI es requerido"],
      trim: true,
    },
    direccion: {
      type: String,
      required: [true, "Dirección es requerida"],
      trim: true,
    },
    telefono: {
      type: String,
      required: [true, "Teléfono es requerido"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Correo es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Contraseña es requerida"],
      minLength: [8, "La contraseña debe tener al menos 8 caracteres"],
    },
    nombreTrabajo: {
      type: String,
      required: [true, "Nombre de trabajo es requerido"],
      trim: true,
    },
    montoMensual: {
      type: Number,
      required: [true, "Ingresos mensuales son requeridos"],
      validate: {
        validator: function (value) {
          return value >= 100;
        },
        message: "Los ingresos mensuales deben ser al menos Q100",
      },
    },
    codigoBanco: {
      type: String,
      default: () => Math.floor(100000 + Math.random() * 900000).toString(),
      unique: true,
    },
    saldo: {
      type: Number,
      default: 0,
      min: [0, "El saldo no puede ser negativo"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "CLIENT"],
      default: "CLIENT",
      required: [true, "El rol es requerido"],
    },
    state: {
      type: Boolean,
      default: true,
    },
    resetToken: {
      type: String,
      default: null,
    },
    resetTokenExpires: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

UserSchema.methods.toJSON = function () {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
};

export default model("User", UserSchema);
