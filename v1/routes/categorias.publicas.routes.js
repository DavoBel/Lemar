import express from "express";
import { obtenerCategorias } from "../controllers/categorias.controller.js";

// Listar las categorías no expone nada: son los nombres que el catálogo ya
// muestra en cada aviso. El sitio público las necesita con su id para el
// filtro, y derivarlas de los vehículos cargados no sirve porque con paginado
// solo se verían las de la página actual.
//
// Alta y baja siguen protegidas en categorias.routes.js.
const router = express.Router();

router.get("/", obtenerCategorias);

export default router;
