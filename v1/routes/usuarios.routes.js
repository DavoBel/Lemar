import express from 'express';
import { obtenerUsuarios } from '../controllers/usuario.controller.js';
const router = express.Router({mergeParams: true});

router.get('/', obtenerUsuarios);

export default router;
