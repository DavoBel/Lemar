import express from 'express';
import { obtenerUsuarios, crearUsuario, editarUsuario } from '../controllers/usuario.controller.js';
import { validateBodyMiddleware } from '../middlewares/validateBody.middleware.js';
import { usuarioSchema, usuarioPatchSchema } from '../validators/usuario.validator.js';

const router = express.Router({ mergeParams: true });

router.get('/', obtenerUsuarios);
router.post('/', validateBodyMiddleware(usuarioSchema), crearUsuario);
router.patch('/:id', validateBodyMiddleware(usuarioPatchSchema), editarUsuario);
export default router;