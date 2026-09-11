import express from "express";
import { obtenerVehiculosPublicos } from "../controllers/vehiculos.controller.js";

const router = express.Router();

router.get("/", obtenerVehiculosPublicos);

export default router;
