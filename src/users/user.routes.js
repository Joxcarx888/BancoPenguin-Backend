import { Router } from "express";
import { check } from "express-validator";
import {
  getAllUsers,
  getUsersByRole,
  getMyProfile,
  updateMyProfile,
  updateUserByAdmin,
  deleteUserByAdmin,
  forgotPassword,
  resetPassword,
  acceptUser
} from "./user.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { tieneRole } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
  '/forgot-password',
   forgotPassword
);

router.post
(
  '/reset-password/:token',
  [
    check("newPassword", "La nueva contraseña debe tener al menos 8 caracteres").optional().isLength({ min: 8 }),
  ],
   resetPassword
);

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
  "/me",
  [
    validarJWT, 
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

router.put(
  "/aceptar/:id",
  [
    validarJWT,
    check("id", "El ID no es válido").isMongoId(),
    validarCampos
  ],
  acceptUser
);

export default router;
