import express from 'express';
import {authorizationMiddleware} from "./middlewares/authorization.middleware.js";
import authRouter from "./routes/auth.routes.js";
import categoriasRouter from "./routes/categorias.routes.js";
import vehiculosRouter from "./routes/vehiculos.routes.js";
import vehiculosPublicosRouter from "./routes/vehiculos.publicos.routes.js";
import ofertasRouter from "./routes/ofertas.routes.js";
import ofertasPublicasRouter from "./routes/ofertas.publicas.routes.js";

const router = express.Router({mergeParams: true});

//rutas desprotegidas
router.use('/auth', authRouter);
router.use('/vehiculos/publicos', vehiculosPublicosRouter);
router.use('/ofertas/publicas', ofertasPublicasRouter);   // ← nuevo
router.use(authorizationMiddleware);
//rutas protegidas
router.use('/vehiculos', vehiculosRouter);
router.use('/categorias', categoriasRouter);
router.use('/ofertas', ofertasRouter);  



export default router;