import express from 'express';
import {authorizationMiddleware} from "./middlewares/authorization.middleware.js";
const router = express.Router({mergeParams: true});

//login y registro
router.use(authorizationMiddleware);

//rutas protegidas


export default router;