import { Router } from "express";
import { check } from "express-validator";
import {
  getAllUsers,
  getUsersByRole,
  getMyProfile,
  updateMyProfile,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.get(
  "/",
  [
    validarJWT,
    tieneRole("ADMIN"),
  ],
  getAllUsers
);

router.get(
  "/by-role",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("role", "El rol es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  getUsersByRole
);

router.get(
  "/me",
  [
    validarJWT,
  ],
  getMyProfile
);

router.put(
  "/me/:id",
  [
    validarJWT,
    check("id", "ID de usuario inválido").isMongoId(),
    validarCampos,
  ],
  updateMyProfile
);

router.put(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("id", "ID de usuario inválido").isMongoId(),
    validarCampos,
  ],
  updateUserByAdmin
);

router.delete(
  "/:id",
  [
    validarJWT,
    tieneRole("ADMIN"),
    check("id", "ID de usuario inválido").isMongoId(),
    validarCampos,
  ],
  deleteUserByAdmin
);

export default router;
