import { getCategorias } from "../services/categoria.services.js";

export const obtenerCategorias = async (req, res) => {
    const categorias = await getCategorias();
    res.status(200).json(categorias);
};