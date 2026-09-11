import express from "express";
import { obtenerVehiculosPublicos, obtenerVehiculoPublicoID } from "../controllers/vehiculos.controller.js";

const router = express.Router();

router.get("/", obtenerVehiculosPublicos);
router.get("/:id", obtenerVehiculoPublicoID);
export default router;
