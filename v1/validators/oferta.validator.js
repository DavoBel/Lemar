import joi from "joi";

const ESTADOS = ["nueva", "en_revision", "tasada", "rechazada", "aceptada"];

export const ofertaEstadoSchema = joi.object({
    estado: joi.string().valid(...ESTADOS).required().messages({
        "any.only": `El estado debe ser uno de: ${ESTADOS.join(", ")}`,
        "string.base": "Elija el estado",
        "string.empty": "Elija el estado",
        "any.required": "Elija el estado",
    }),
});

export const tasacionSchema = joi.object({
    valor: joi.number().integer().min(0).required().messages({
        "number.base": "Ingrese el valor de la tasación",
        "number.integer": "El valor debe ser un número entero, sin centavos",
        "number.min": "El valor no puede ser negativo",
        "any.required": "Ingrese el valor de la tasación",
    }),
    nota: joi.string().trim().max(1000).allow("").default("").messages({
        "string.max": "La nota no puede superar los 1000 caracteres",
    }),
});