import {prisma} from "../../db.js"

export const getOfertasService = async () =>{
    return await prisma.oferta.findMany({
        orderBy: { fecha_creacion: 'desc'}
    });
} 