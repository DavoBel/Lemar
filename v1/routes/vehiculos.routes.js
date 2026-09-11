import express from "express";
import { obtenerVehiculos, obtenerVehiculoID, agregarVehiculo, editarVehiculo, eliminarVehiculo } from "../controllers/vehiculos.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { vehiculoSchema, vehiculoPatchSchema } from "../validators/vehiculo.validator.js";

const router = express.Router();

router.get("/", obtenerVehiculos);
router.get("/:id", obtenerVehiculoID);
router.post("/", validateBodyMiddleware(vehiculoSchema), agregarVehiculo);
router.patch("/:id", validateBodyMiddleware(vehiculoPatchSchema), editarVehiculo);
router.delete("/:id", eliminarVehiculo);

export default router;
