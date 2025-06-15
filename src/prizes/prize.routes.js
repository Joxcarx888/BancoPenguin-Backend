import { Router } from "express";
import { crearPrize, editarPrize, listarPrizes, eliminarPrize } from "../prizes/prize.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();


router.post("/", validarJWT, crearPrize);


router.put("/:prizeId", validarJWT, editarPrize);

router.delete("/:prizeId", validarJWT, eliminarPrize);

router.get("/prizes", listarPrizes);

export default router;
