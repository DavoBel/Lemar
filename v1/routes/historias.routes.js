import express from 'express';
import { registrarHistoria } from '../controllers/usuario.controller.js';

const router = express.Router();

router.post('/', registrarHistoria);

export default router;