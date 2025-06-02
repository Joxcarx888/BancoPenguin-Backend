import { body } from "express-validator";
import mongoose from "mongoose";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";


export const loginValidator = [
  body("email").optional().isEmail().withMessage("Enter a valid email address"),
  body("username").optional().isString().withMessage("Enter a valid username"),
  body("password", "Password must be at least 8 characters").isLength({ min: 8 }),
  validarCampos,
];


