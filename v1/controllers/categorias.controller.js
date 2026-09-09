import { getCategoriasService, agregarCategoriaService, getCategoriaXNombreService } from "../services/categoria.services.js";
import { AppError } from "../utils/AppError.js";

export const obtenerCategorias = async (req, res) => {
    const categorias = await getCategoriasService();
    res.status(200).json(categorias);
};

export const agregarCategoria = async (req, res) => {
    const { nombre } = req.validatedBody;
    const existente = await getCategoriaXNombreService(nombre);
    if (existente) throw new AppError(409, `Ya existe una categoría llamada "${existente.nombre}".`);
    const nuevaCategoria = await agregarCategoriaService(nombre);
    res.status(201).json(nuevaCategoria);
};