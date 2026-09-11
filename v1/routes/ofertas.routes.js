import express from 'express'
import { obtenerOfertas } from "../controllers/ofertas.controller.js";

const router = express.Router();

router.get("/", obtenerOfertas)

export default router;