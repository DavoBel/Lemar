import { incrementarHistoriasService } from '../services/usuario.services.js';

export const registrarHistoria = async (req, res) => {
    await incrementarHistoriasService(req.usuario.id);
    res.status(204).send();
};