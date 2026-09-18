import { Prisma } from "@prisma/client";
import { AppError } from "../utils/AppError.js";

export const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  if (err instanceof AppError) return res.status(err.status).json({ error: err.message });

  if (err.type === "entity.parse.failed") return res.status(400).json({ error: "El cuerpo de la petición no es JSON válido." });

  if (err instanceof Prisma.PrismaClientKnownRequestError) {

    if (err.code === "P2002") {
      if (Array.isArray(err.meta?.target)){
        let campo = err.meta.target.join(", ")
        err.meta.target.length > 1 ? campo = `los datos: ${campo}` : campo = `el dato: ${campo}`;
        return res.status(409).json({ error: `Ya existe un registro guardado con ${campo} que intentás usar.` });
      } 
      return res.status(409).json({ error: `Ya existe un registro guardado con ese dato.` });
    }

    if (err.code === "P2003")return res.status(409).json({ error: "No se puede borrar: hay otros registros que dependen de este." });
    
    if (err.code === "P2025")return res.status(404).json({ error: "No se encontró el registro." });
  }

  if (err instanceof Prisma.PrismaClientValidationError) return res.status(400).json({ error: "Los datos enviados no tienen el formato esperado." });
  
  if (err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE")  return res.status(400).json({ error: "Cada foto puede pesar hasta 10 MB." });
    if (err.code === "LIMIT_FILE_COUNT") return res.status(400).json({ error: "Se pueden subir hasta 10 fotos por vez." });
    return res.status(400).json({ error: "No se pudo procesar el archivo enviado." });
}

  return res.status(500).json({ error: "Ocurrió un error inesperado. Intentá de nuevo." });
}