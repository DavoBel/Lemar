import express from 'express';
import { getEventos, crearEvento } from '../controllers/evento.controller.js';
import {validateBodyMiddleware} from '../middlewares/validateBody.middleware.js';
import { eventoSchema } from '../validators/evento.validator.js';
const router = express.Router();

router.get('/', getEventos);
router.post('/', validateBodyMiddleware(eventoSchema), crearEvento);


export default router;