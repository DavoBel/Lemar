import { incrementarHistoriasService, getUsuariosService, getUsuarioXEmail, crearUsuarioService, getUsuarioXIdService, editarUsuarioService } from '../services/usuario.services.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../utils/AppError.js';
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

export const crearUsuario = async (req, res) => {
    const email = req.validatedBody.email.toLowerCase();
    const {nombre_completo, contrasena, rol } = req.validatedBody;
    const existente = await getUsuarioXEmail(email);
    if (existente) throw new AppError(409, `Ya existe una cuenta con el email ${email}.`);
    const hash = await bcrypt.hash(contrasena, 10);
    const usuario = await crearUsuarioService({ email, nombre_completo, contrasena: hash, rol, activo: true });
    res.status(201).json(new UsuarioDTO(usuario));
};

export const editarUsuario = async (req, res) => {
    const { id } = req.params;
    const actual = await getUsuarioXIdService(id);
    if (!actual) throw new AppError(404, "No se encontró el usuario.");

    if (id === req.usuario.id) {
        throw new AppError(400, "No podés cambiar tu propio rol ni desactivar tu cuenta.");
    }

    const datos = {};
    for (const clave of Object.keys(req.body)) {
        if (clave in req.validatedBody) datos[clave] = req.validatedBody[clave];
    }
    if (Object.keys(datos).length === 0) {
        throw new AppError(400, "No se envió ningún campo para modificar.");
    }

    const usuario = await editarUsuarioService(id, datos);
    res.status(200).json(new UsuarioDTO(usuario));
};
