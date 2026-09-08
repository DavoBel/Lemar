export class UsuarioDTO {
    constructor({ id, email, nombre_completo, rol, activo, historias, fecha_creacion, fecha_modificacion }) {
        this.id = id;
        this.email = email;
        this.nombre_completo = nombre_completo;
        this.rol = rol;
        this.activo = activo;
        this.historias = historias;
        this.fecha_creacion = fecha_creacion;
        this.fecha_modificacion = fecha_modificacion;
    }
}
