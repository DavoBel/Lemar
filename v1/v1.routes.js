import express from 'express';
import {authorizationMiddleware} from "./middlewares/authorization.middleware.js";
import authRouter from "./routes/auth.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import vehiculosRouter from "./routes/vehiculos.routes.js";

const router = express.Router({mergeParams: true});

//rutas desprotegidas
router.use('/auth', authRouter);
router.use(authorizationMiddleware);
//rutas protegidas
router.use('/categorias', categoriasRouter);
router.use('/vehiculos', vehiculosRouter);

export default router;