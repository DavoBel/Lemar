import express from "express";
import { obtenerVehiculos, obtenerVehiculoID } from "../controllers/vehiculos.controller.js";

const router = express.Router();

router.get("/", obtenerVehiculos);
router.get("/:id", obtenerVehiculoID);

export default router;
