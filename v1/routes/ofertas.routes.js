import express from 'express'
import { obtenerOfertas, editarEstadoOferta, editarTasacion } from "../controllers/ofertas.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { ofertaEstadoSchema, tasacionSchema } from "../validators/oferta.validator.js";

const router = express.Router();

router.get("/", obtenerOfertas)
router.patch("/:id", validateBodyMiddleware(ofertaEstadoSchema), editarEstadoOferta);
router.put("/:id/tasacion", validateBodyMiddleware(tasacionSchema), editarTasacion);
export default router;