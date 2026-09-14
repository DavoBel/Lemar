import { incrementarHistoriasService, getUsuariosService } from '../services/usuario.services.js';
import { UsuarioDTO } from '../utils/DTOs/usuario/Usuario.dto.js';
import { getPaginacion } from '../utils/helpers.js';

export const registrarHistoria = async (req, res) => {
    await incrementarHistoriasService(req.usuario.id);
    res.status(204).send();
};

export const obtenerUsuarios = async (req, res) => {
    const { limite, pagina, skip } = getPaginacion(req);
    const { datos, total } = await getUsuariosService(limite, skip);
    res.status(200).json({
        datos: datos.map(u => new UsuarioDTO(u)),
        total,
        pagina,
        paginas: Math.ceil(total / limite),
    });
};


