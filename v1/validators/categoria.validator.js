import joi from "joi";

const categoriaSchema = joi.object({
  nombre: joi.string().trim().min(2).max(40).required().messages({
    "string.min": "El nombre debe tener al menos 2 caracteres",
    "string.max": "El nombre no debe exceder los 40 caracteres",
    "string.empty": "Ingrese un nombre",
    "any.required": "Ingrese un nombre",
  }),
});

export default categoriaSchema;