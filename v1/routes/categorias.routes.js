import express from "express";
import { obtenerCategorias, agregarCategoria } from "../controllers/categorias.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import categoriaSchema from "../validators/categoria.validator.js";

const router = express.Router();

router.get("/", obtenerCategorias);
router.post("/", validateBodyMiddleware(categoriaSchema), agregarCategoria);

export default router;