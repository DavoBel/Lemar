import { prisma } from '../../db.js';

export const getEventosService = async (desde, hasta) => {
    return prisma.evento.findMany({
        where: { inicio: { lte: hasta }, fin: { gte: desde } },
        orderBy: [{ inicio: "asc" }, { id: "asc" }],
    });
};