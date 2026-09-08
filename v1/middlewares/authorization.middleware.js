import jwt from "jsonwebtoken";
import { AppError } from "../utils/AppError.js";

export const authorizationMiddleware = (req, res, next) => {

    const token = req.cookies?.token;
    if (!token) return next(new AppError(401, "No hay sesión activa. Inicie sesión nuevamente."));

    try {
        req.usuario = jwt.verify(token, process.env.SECRET_JWT);
        next();
    } catch {
        next(new AppError(401, "Sesión inválida o expirada. Inicie sesión nuevamente."));
    }
}