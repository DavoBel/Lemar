import express from "express";
import { obtenerVehiculos } from "../controllers/vehiculos.controller.js";

const router = express.Router();

router.get("/", obtenerVehiculos);

export default router;
