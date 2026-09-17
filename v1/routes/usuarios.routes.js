import express from 'express';
import { obtenerUsuarios, crearUsuario } from '../controllers/usuario.controller.js';
import { validateBodyMiddleware } from '../middlewares/validateBody.middleware.js';
import { usuarioSchema } from '../validators/usuario.validator.js';

const router = express.Router({ mergeParams: true });

router.get('/', obtenerUsuarios);
router.post('/', validateBodyMiddleware(usuarioSchema), crearUsuario);

export default router;