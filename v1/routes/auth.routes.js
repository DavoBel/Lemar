import express from "express";
import { validateBodyMiddleware } from "../middlewares/validateBody.middleware.js";
import loginSchema from "../validators/login.validator.js";
import {login} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/login", validateBodyMiddleware(loginSchema), login);
 
export default router;