import express from 'express';
import {authorizationMiddleware} from "./middlewares/authorization.middleware.js";
import authRouter from "./routes/auth.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";

const router = express.Router({mergeParams: true});

//rutas desprotegidas
router.use('/auth', authRouter);
router.use(authorizationMiddleware);
//rutas protegidas
router.use('/categorias', categoriasRouter);
export default router;