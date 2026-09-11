import { AppError } from "../utils/AppError.js";

export const validateBodyMiddleware = schema => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return next(new AppError(400, error.details.map(d => d.message).join(". ")));
    }
    req.validatedBody = value;
    next();
};