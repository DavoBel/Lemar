import joi from "joi";
import { tiposDeEvento } from "../utils/helpers.js";

const texto = (max) => joi.string().trim().max(max).allow("").default("");

export const eventoSchema = joi.object({
    tipo: joi.string().valid(...tiposDeEvento).required().messages({
        "any.only": `El tipo debe ser uno de: ${tiposDeEvento.join(", ")}`,
        "any.required": "Elija el tipo de evento",
    }),
    cliente: joi.string().trim().min(2).max(80).required().messages({
        "string.base": "Ingrese el nombre del cliente",
        "string.empty": "Ingrese el nombre del cliente",
        "string.min": "Ingrese el nombre completo del cliente",
        "string.max": "El nombre no puede superar los 80 caracteres",
        "any.required": "Ingrese el nombre del cliente",
    }),
    telefono: joi.string().trim().min(6).max(20).allow("").default("").messages({
        "string.min": "El teléfono es demasiado corto",
        "string.max": "El teléfono no puede superar los 20 caracteres",
    }),
    inicio: joi.date().iso().required().messages({
        "date.base": "La fecha y hora de inicio no es válida",
        "date.format": "La fecha y hora de inicio no es válida",
        "any.required": "Ingrese la fecha y hora del evento",
    }),
    fin: joi.date().iso().greater(joi.ref("inicio")).required().messages({
        "date.base": "La fecha y hora de fin no es válida",
        "date.format": "La fecha y hora de fin no es válida",
        "date.greater": "El fin tiene que ser posterior al inicio",
        "any.ref": "Revise la fecha y hora de inicio",
        "any.required": "Ingrese la duración del evento",
    }),
    vehiculo: texto(80).messages({
        "string.max": "El vehículo no puede superar los 80 caracteres",
    }),
    nota: texto(1000).messages({
        "string.max": "La nota no puede superar los 1000 caracteres",
    }),
});