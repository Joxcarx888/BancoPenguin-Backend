import { Router } from "express";
import { agregarAFavoritos, eliminarDeFavoritos, listarFavoritos } from "./favorite.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post("/", validarJWT, agregarAFavoritos);
router.delete("/:favoritoId", validarJWT, eliminarDeFavoritos);
router.get("/", validarJWT, listarFavoritos);


export default router;
