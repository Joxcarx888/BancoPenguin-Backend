import { Router } from "express";
import { crearMovimiento } from "./movement.controller.js";

const router = Router();


router.post(
    "/crear",
    crearMovimiento
);

export default router;
