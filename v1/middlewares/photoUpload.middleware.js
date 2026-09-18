import multer from "multer";
import { AppError } from "../utils/AppError.js";

export const photoUploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024, files: 10 },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new AppError(400, "Solo se pueden subir imágenes."));
        }
        cb(null, true);
    },
}).array("fotos", 10);