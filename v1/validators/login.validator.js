import joi from "joi";

const loginSchema = joi.object({
  email: joi.string().email().required().messages({
    "string.email": "Ingrese un correo valido",
    "string.empty": "Ingrese un correo",
    "any.required": "Ingrese un correo",
  }),
  contrasena: joi.string().min(8).max(30).required().messages({
    "string.min": "La contraseña debe tener al menos 8 caracteres",
    "string.max": "La contraseña no debe exceder los 30 caracteres",
    "string.empty": "Ingrese una contraseña",
    "any.required": "Ingrese una contraseña"
  }),
});

export default loginSchema;