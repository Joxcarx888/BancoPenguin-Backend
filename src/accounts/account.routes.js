import express from "express";
import { crearCuenta } from "./account.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js"; 
const router = express.Router();

router.post(
    "/solicitar",
    validarJWT,
    crearCuenta
);

export default router;
