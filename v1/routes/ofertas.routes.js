import express from 'express'
import { obtenerOfertas, editarEstadoOferta } from "../controllers/ofertas.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { ofertaEstadoSchema } from "../validators/oferta.validator.js";

const router = express.Router();

router.get("/", obtenerOfertas)
router.patch("/:id", validateBodyMiddleware(ofertaEstadoSchema), editarEstadoOferta);

export default router;