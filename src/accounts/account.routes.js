import { Router } from "express";
import {
  crearCuenta,
  getPendingAccounts,
  getActiveAccounts,
  acceptAccount,
  getMyAccounts,
  deleteAccount
} from "../accounts/account.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post("/solicitar", validarJWT, crearCuenta);

router.get("/pendientes", validarJWT, getPendingAccounts);

router.get("/activas", validarJWT, getActiveAccounts);

router.put("/aceptar/:id", validarJWT, acceptAccount);

router.get("/mias", validarJWT, getMyAccounts);

router.put("/desactivar/:id", validarJWT, deleteAccount);


export default router;
