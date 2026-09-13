import { prisma } from '../../db.js';

export const getEventosService = async (desde, hasta) => {
    return prisma.evento.findMany({
        where: { inicio: { lte: hasta }, fin: { gte: desde } },
        orderBy: [{ inicio: "asc" }, { id: "asc" }],
    });
};

export const getSolapadosService = async (inicio, fin) => {
    return prisma.evento.findMany({
        where: { inicio: { lt: fin }, fin: { gt: inicio } },
        orderBy: { inicio: "asc" },
        take: 5,
    });
};

export const crearEventoService = async (datos) => {
    return prisma.evento.create({ data: datos });
};