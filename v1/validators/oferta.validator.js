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