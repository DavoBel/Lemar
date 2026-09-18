import express from 'express';
import { obtenerResumen } from '../controllers/metricas.controller.js';
const router = express.Router({ mergeParams: true });

router.get('/resumen', obtenerResumen);

export default router;