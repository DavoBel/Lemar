import {prisma} from "../../db.js"

export const getUsuariosService = async (limite, skip) => {
    const [datos, total] = await prisma.$transaction([
        prisma.usuario.findMany({
            select: { id: true, email: true, nombre_completo: true, rol: true,
                      activo: true, historias: true, fecha_creacion: true, fecha_modificacion: true },
            orderBy: [{ rol: "asc" }, { nombre_completo: "asc" }, { id: "asc" }],
            skip,
            take: limite,
        }),
        prisma.usuario.count(),
    ]);
    return { datos, total };
};

export const getUsuarioXIdService = async (id) => {
    return prisma.usuario.findUnique({
        where: { id },
        select: { id: true, rol: true, activo: true },
    });
};

export const getUsuarioXEmail = async(email) => {
    return await prisma.usuario.findUnique({where: {email: email}})
}

export const incrementarHistoriasService = async (id) => {
    return prisma.usuario.update({
        where: { id },
        data: { historias: { increment: 1 } },
    });
};

export const crearUsuarioService = async (usuario) => {
    return prisma.usuario.create({
        data: usuario,
        select: { id: true, email: true, nombre_completo: true, rol: true,
                  activo: true, historias: true, fecha_creacion: true, fecha_modificacion: true },
    });
};



