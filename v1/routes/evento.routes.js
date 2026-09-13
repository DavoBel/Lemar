import express from 'express';
import { getEventos, crearEvento, editarEvento, eliminarEvento } from '../controllers/evento.controller.js';
import {validateBodyMiddleware} from '../middlewares/validateBody.middleware.js';
import { eventoSchema, eventoPatchSchema } from '../validators/evento.validator.js';
const router = express.Router();

router.get('/', getEventos);
router.post('/', validateBodyMiddleware(eventoSchema), crearEvento);
router.patch('/:id', validateBodyMiddleware(eventoPatchSchema), editarEvento);
router.delete('/:id', eliminarEvento); 

export default router;