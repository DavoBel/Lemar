import joi from 'joi';
import { roles } from '../utils/helpers.js';

export const usuarioSchema = joi.object({
    email: joi.string().trim().lowercase().email().max(120).required().messages({
        "string.email": "Ingrese un email válido",
        "string.empty": "Ingrese el email",
        "any.required": "Ingrese el email",
    }),
    nombre_completo: joi.string().trim().min(2).max(80).required().messages({
        "string.min": "Ingrese el nombre completo",
        "string.empty": "Ingrese el nombre completo",
        "any.required": "Ingrese el nombre completo",
    }),
    contrasena: joi.string().min(8).max(72).required().messages({
        "string.min": "La contraseña debe tener al menos 8 caracteres",
        "string.empty": "Ingrese una contraseña",
        "any.required": "Ingrese una contraseña",
    }),
    rol: joi.string().valid(...roles).required().messages({
        "any.only": "El rol debe ser admin o empleado",
        "any.required": "Elija el rol",
    }),
});