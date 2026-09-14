import {prisma} from "../../db.js"

export const getUsuarioXEmail = async(email) => {
    return await prisma.usuario.findUnique({where: {email: email}})
}

export const incrementarHistoriasService = async (id) => {
    return prisma.usuario.update({
        where: { id },
        data: { historias: { increment: 1 } },
    });
};