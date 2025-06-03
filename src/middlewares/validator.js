import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";


export const loginValidator = [
  body("email")
    .optional()
    .isEmail()
    .withMessage("Ingresa un correo válido"),
  body("username")
    .optional()
    .isString()
    .withMessage("Ingresa un nombre de usuario válido"),
  body("password", "La contraseña debe tener al menos 8 caracteres")
    .isLength({ min: 8 }),
  validarCampos,
];


export const registerValidator = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 35 })
    .withMessage("El nombre no puede exceder los 35 caracteres"),

  body("username")
    .notEmpty()
    .withMessage("El username es obligatorio"),

  body("dpi")
    .notEmpty()
    .withMessage("El DPI es obligatorio"),

  body("direccion")
    .notEmpty()
    .withMessage("La dirección es obligatoria"),

  body("telefono")
    .notEmpty()
    .withMessage("El teléfono es obligatorio"),

  body("email")
    .notEmpty()
    .withMessage("El correo es obligatorio")
    .isEmail()
    .withMessage("Debe ser un correo válido")
    .custom(existenteEmail),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 8 })
    .withMessage("La contraseña debe tener al menos 8 caracteres"),

  body("nombreTrabajo")
    .notEmpty()
    .withMessage("El nombre del trabajo es obligatorio"),

  body("montoMensual")
    .notEmpty()
    .withMessage("El monto mensual es obligatorio")
    .isNumeric()
    .withMessage("El monto mensual debe ser un número")
    .custom(value => {
      if (value < 100) {
        throw new Error("El monto mensual debe ser al menos Q100");
      }
      return true;
    }),

  validarCampos,
];
