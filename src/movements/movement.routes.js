import { Router } from "express";
import { crearMovimiento, cancelarMovimiento } from "./movement.controller.js";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/crear",
    validarJWT,
    crearMovimiento
);


router.put(
    "/cancelar/:movimientoId", 
    validarJWT,
    cancelarMovimiento
);

export default router;
