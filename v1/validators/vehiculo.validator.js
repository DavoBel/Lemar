import joi from "joi";

const COMBUSTIBLES = ["Nafta", "Diésel", "Híbrido", "Eléctrico"];
const CAJAS = ["Manual", "Automática"];
const MONEDAS = ["USD", "UYU"];
const anioMaximo = new Date().getFullYear() + 1;

const texto = (max) => joi.string().trim().max(max).allow("").default("");

export const vehiculoSchema = joi.object({
    //obligatorios
    marca: joi.string().trim().min(1).max(40).required().messages({
        "string.empty": "Ingrese la marca",
        "any.required": "Ingrese la marca",
    }),
    modelo: joi.string().trim().min(1).max(40).required().messages({
        "string.empty": "Ingrese el modelo",
        "any.required": "Ingrese el modelo",
    }),
    anio: joi.number().integer().min(1950).max(anioMaximo).required().messages({
        "number.min": "El año debe ser 1950 o posterior",
        "number.max": `El año no puede ser mayor a ${anioMaximo}`,
        "number.base": "El año debe ser un número",
        "any.required": "Ingrese el año",
    }),
    km: joi.number().integer().min(0).required().messages({
        "number.min": "El kilometraje no puede ser negativo",
        "any.required": "Ingrese el kilometraje",
    }),
    patente: joi.string().trim().max(10).required().messages({
        "string.empty": "Ingrese la patente",
        "any.required": "Ingrese la patente",
    }),
    combustible: joi.string().valid(...COMBUSTIBLES).required().messages({
        "any.only": `El combustible debe ser uno de: ${COMBUSTIBLES.join(", ")}`,
        "any.required": "Elija el combustible",
    }),
    caja: joi.string().valid(...CAJAS).required().messages({
        "any.only": `La caja debe ser: ${CAJAS.join(" o ")}`,
        "any.required": "Elija el tipo de caja",
    }),
    categoria_id: joi.string().trim().required().messages({
        "string.empty": "Elija una categoría",
        "any.required": "Elija una categoría",
    }),
    precio: joi.number().integer().greater(0).required().messages({
        "number.greater": "El precio debe ser mayor a cero",
        "any.required": "Ingrese el precio",
    }),
    moneda: joi.string().valid(...MONEDAS).required().messages({
        "any.only": "La moneda debe ser USD o UYU",
        "any.required": "Elija la moneda",
    }),
    //obligatorios
    color: texto(30),
    motor: texto(40),
    consumo: texto(30),
    potencia: texto(30),
    descripcion: texto(2000),
    version: texto(60),
    caracteristicas: joi.array().items(joi.string().trim().max(60)).default([]),
    precio_compra: joi.number().integer().min(0).allow(null).default(null),
    fotos: joi.array().items(joi.string().trim()).default([]),
});

export const vehiculoPatchSchema = vehiculoSchema.fork(
    Object.keys(vehiculoSchema.describe().keys),
    (campo) => campo.optional()
).append({
    estado: joi.string().valid("disponible", "reservado", "vendido").messages({
        "any.only": "El estado debe ser: disponible, reservado o vendido",
    }),
});

export default vehiculoSchema;