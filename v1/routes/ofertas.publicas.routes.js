// v1/routes/ofertas.publicas.routes.js
import express from "express";
import rateLimit from "express-rate-limit";
import { agregarOfertaPublica } from "../controllers/ofertas.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import { ofertaSchema } from "../validators/oferta.validator.js";

const limitarAltaOfertas = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Demasiadas solicitudes. Intente de nuevo en unos minutos." },
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

router.post("/", limitarAltaOfertas, validateBodyMiddleware(ofertaSchema), agregarOfertaPublica);

export default router;