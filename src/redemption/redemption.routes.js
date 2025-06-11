import { Router } from "express";
import { check } from "express-validator";
import { createRedemption, getRedemptions } from "./redemption.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
  "/canjear",
  [
    validarJWT, 
    check("prizeId", "ID de recompensa es requerido").isMongoId(),
    check("numeroCuenta", "Número de cuenta es requerido").not().isEmpty(),
    validarCampos,
  ],
  createRedemption
);

router.get(
    "/",
    [
      validarJWT, 
    ],
    getRedemptions
  );

export default router;
