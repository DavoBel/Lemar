import joi from "joi";
import { combustibles, cajas, anioActualMasUno, estadosOferta } from "../utils/helpers.js";

const texto = (max) => joi.string().trim().max(max).allow("").default("");

export const ofertaEstadoSchema = joi.object({
    estado: joi.string().valid(...estadosOferta).required().messages({
        "any.only": `El estado debe ser uno de: ${estadosOferta.join(", ")}`,
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

export const ofertaSchema = joi.object({
    marca: joi.string().trim().min(1).max(40).required().messages({
        "string.base": "Ingrese la marca",
        "string.empty": "Ingrese la marca",
        "string.max": "La marca no puede superar los 40 caracteres",
        "any.required": "Ingrese la marca",
    }),
    modelo: joi.string().trim().min(1).max(40).required().messages({
        "string.base": "Ingrese el modelo",
        "string.empty": "Ingrese el modelo",
        "string.max": "El modelo no puede superar los 40 caracteres",
        "any.required": "Ingrese el modelo",
    }),
    anio: joi.number().integer().min(1950).max(anioActualMasUno).required().messages({
        "number.base": "El año debe ser un número",
        "number.integer": "El año debe ser un número entero",
        "number.min": "El año debe ser 1950 o posterior",
        "number.max": `El año no puede ser mayor a ${anioActualMasUno}`,
        "any.required": "Ingrese el año del vehículo",
    }),
    km: joi.number().integer().min(0).required().messages({
        "number.base": "El kilometraje debe ser un número",
        "number.integer": "El kilometraje debe ser un número entero",
        "number.min": "El kilometraje no puede ser negativo",
        "any.required": "Ingrese el kilometraje",
    }),
    patente: joi.string().trim().max(10).required().messages({
        "string.base": "Ingrese la patente",
        "string.empty": "Ingrese la patente",
        "string.max": "La patente no puede superar los 10 caracteres",
        "any.required": "Ingrese la patente",
    }),
    combustible: joi.string().valid(...combustibles).required().messages({
        "any.only": `El combustible debe ser uno de: ${combustibles.join(", ")}`,
        "string.base": "Elija el combustible",
        "string.empty": "Elija el combustible",
        "any.required": "Elija el combustible",
    }),
    caja: joi.string().valid(...cajas).required().messages({
        "any.only": `La caja debe ser: ${cajas.join(" o ")}`,
        "string.base": "Elija el tipo de caja",
        "string.empty": "Elija el tipo de caja",
        "any.required": "Elija el tipo de caja",
    }),
    nombre: joi.string().trim().min(2).max(80).required().messages({
        "string.base": "Ingrese su nombre",
        "string.empty": "Ingrese su nombre",
        "string.min": "Ingrese su nombre completo",
        "string.max": "El nombre no puede superar los 80 caracteres",
        "any.required": "Ingrese su nombre",
    }),
    telefono: joi.string().trim().min(6).max(20).required().messages({
        "string.base": "Ingrese un teléfono de contacto",
        "string.empty": "Ingrese un teléfono de contacto",
        "string.min": "El teléfono es demasiado corto",
        "string.max": "El teléfono no puede superar los 20 caracteres",
        "any.required": "Ingrese un teléfono de contacto",
    }),

    version: texto(60).messages({
        "string.max": "La versión no puede superar los 60 caracteres",
    }),
    color: texto(30).messages({
        "string.max": "El color no puede superar los 30 caracteres",
    }),
    motor: texto(40).messages({
        "string.max": "El motor no puede superar los 40 caracteres",
    }),
    desperfectos: texto(2000).messages({
        "string.max": "Los desperfectos no pueden superar los 2000 caracteres",
    }),
    accesorios: texto(2000).messages({
        "string.max": "Los accesorios no pueden superar los 2000 caracteres",
    }),
    duenos: joi.number().integer().min(1).default(1).messages({
        "number.base": "La cantidad de dueños debe ser un número",
        "number.integer": "La cantidad de dueños debe ser un número entero",
        "number.min": "La cantidad de dueños debe ser al menos 1",
    }),

    choques: joi.string().valid("no", "menores", "importantes").default("no").messages({
        "any.only": "Elija una opción válida sobre choques o reparaciones",
    }),
    deuda_prenda: joi.string().valid("no", "deuda", "prenda", "ambas").default("no").messages({
        "any.only": "Elija una opción válida sobre deuda o prenda",
    }),
    titularidad: joi.string().valid("propio", "tercero").default("propio").messages({
        "any.only": "Elija si el vehículo está a su nombre o de un tercero",
    }),
    vtv: joi.string().valid("al_dia", "vencida").default("al_dia").messages({
        "any.only": "Elija si la VTV está al día o vencida",
    }),
    documentacion: joi.string().valid("completa", "incompleta").default("completa").messages({
        "any.only": "Elija si la documentación está completa o incompleta",
    }),
    multas: joi.string().valid("si", "no").default("no").messages({
        "any.only": "Elija si el vehículo tiene multas",
    }),

    empresa: joi.any().default(""),
});