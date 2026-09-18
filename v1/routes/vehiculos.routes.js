import express from "express";
import { obtenerVehiculos, obtenerVehiculoID, agregarVehiculo, editarVehiculo, eliminarVehiculo } from "../controllers/vehiculos.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import {authorizationMiddleware} from "../middlewares/authorization.middleware.js";
import { subirFotos } from "../controllers/vehiculos.controller.js";
import { vehiculoSchema, vehiculoPatchSchema } from "../validators/vehiculo.validator.js";
import { photoUploadMiddleware } from "../middlewares/photoUpload.middleware.js";

const router = express.Router();

router.get("/",obtenerVehiculos);
router.post("/fotos", photoUploadMiddleware, subirFotos);
router.get("/:id",obtenerVehiculoID);
router.post("/",validateBodyMiddleware(vehiculoSchema), agregarVehiculo);
router.patch("/:id",validateBodyMiddleware(vehiculoPatchSchema), editarVehiculo);
router.delete("/:id",eliminarVehiculo);


export default router;
