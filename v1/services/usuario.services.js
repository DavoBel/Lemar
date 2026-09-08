import {prisma} from "../../db.js"

export const getUsuarioXEmail = async(email) => {
    return await prisma.usuario.findUnique({where: {email: email}})
}