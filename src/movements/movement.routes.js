import { Router } from "express";
import { crearMovimiento, cancelarMovimiento, getActiveMovements, getCanceledMovements, getMyMovements } from "./movement.controller.js";
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

router.get("/activos", validarJWT, getActiveMovements);
router.get("/cancelados", validarJWT, getCanceledMovements);
router.get("/mios", validarJWT, getMyMovements);

export default router;
