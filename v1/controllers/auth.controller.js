import { AppError } from "../utils/AppError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { getUsuarioXEmail } from "../services/usuario.services.js";
import { UsuarioDTO } from "../utils/DTOs/usuario/Usuario.dto.js";

export const login = async (req, res) =>{
    const email = req.validatedBody.email.trim().toLowerCase();
    const contrasena = req.validatedBody.contrasena.trim();
    const usuario = await getUsuarioXEmail(email);
    const errorCredenciales = new AppError(401, "Email o contraseña incorrectos. Contacte administrador si cree que es un error.");
    if(!usuario || !(await bcrypt.compare(contrasena, usuario.contrasena)) || !usuario.activo) throw errorCredenciales;
    const token = jwt.sign({id: usuario.id, email: usuario.email, rol: usuario.rol}, process.env.SECRET_JWT, {expiresIn: '8h'});
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 8 * 60 * 60 * 1000,
    });
    const usuarioDTO = new UsuarioDTO(usuario);
    res.status(200).json({ ...usuarioDTO });
}

export const obtenerUsuarioActual = async (req, res) => {
    const usuario = req.usuario;
    if(!usuario) throw new AppError(401, "No hay sesión activa. Inicie sesión nuevamente.");
    const usuarioCompleto = await getUsuarioXEmail(usuario.email);
    const usuarioDTO = new UsuarioDTO(usuarioCompleto);
    res.status(200).json({ ...usuarioDTO });
}