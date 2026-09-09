import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import {login, obtenerUsuarioActual, logout} from "../controllers/auth.controller.js";
import loginSchema from "../validators/login.validator.js";
import { authorizationMiddleware } from "../middlewares/authorization.middleware.js";

const router = express.Router();

router.post("/login", validateBodyMiddleware(loginSchema), login);
router.get("/me", authorizationMiddleware, obtenerUsuarioActual);
router.post("/logout", logout);
export default router;