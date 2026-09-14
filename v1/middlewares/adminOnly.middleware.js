import { AppError } from "../utils/AppError.js";
import { getUsuarioXIdService } from "../services/usuario.services.js";

export const adminOnlyMiddleware = async (req, res, next) => {
    const id = req.usuario?.id;
    if (!id) throw new AppError(401, "No hay sesión activa. Inicie sesión nuevamente.");

    const usuario = await getUsuarioXIdService(id);
    if (!usuario || !usuario.activo) {
        throw new AppError(401, "La sesión ya no es válida. Inicie sesión nuevamente.");
    }
    if (usuario.rol !== "admin") {
        throw new AppError(403, "Esta sección es solo para administradores.");
    }
    next();
};