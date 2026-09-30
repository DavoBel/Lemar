import express from "express";
import { agregarCategoria, eliminarCategoria } from "../controllers/categorias.controller.js";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import categoriaSchema from "../validators/categoria.validator.js";

const router = express.Router();

// El GET vive en categorias.publicas.routes.js, fuera de la barrera de sesión.
router.post("/", validateBodyMiddleware(categoriaSchema), agregarCategoria);
router.delete("/:id", eliminarCategoria);

export default router;