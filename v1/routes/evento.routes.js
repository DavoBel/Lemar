import express from 'express';
import { getEventos } from '../controllers/evento.controller.js';

const router = express.Router();

router.get('/', getEventos);

export default router;