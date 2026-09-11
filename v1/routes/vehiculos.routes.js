import express from "express";
import { obtenerVehiculos, obtenerVehiculoID, agregarVehiculo } from "../controllers/vehiculos.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { vehiculoSchema } from "../validators/vehiculo.validator.js";

const router = express.Router();

router.get("/", obtenerVehiculos);
router.get("/:id", obtenerVehiculoID);
router.post("/", validateBodyMiddleware(vehiculoSchema), agregarVehiculo);

export default router;
