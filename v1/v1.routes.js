import express from 'express';
import {authorizationMiddleware} from "./middlewares/authorization.middleware.js";
import authRouter from "./routes/auth.routes.js";

const router = express.Router({mergeParams: true});

//rutas desprotegidas
router.use('/auth', authRouter);

router.use(authorizationMiddleware);

//rutas protegidas


export default router;