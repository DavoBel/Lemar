import { prisma } from '../../db.js';

export const getEventosService = async (desde, hasta) => {
    return prisma.evento.findMany({
        where: { inicio: { lte: hasta }, fin: { gte: desde } },
        orderBy: [{ inicio: "asc" }, { id: "asc" }],
    });
};

export const getEventoByIdService = async (id) => {
    return prisma.evento.findUnique({
        where: { id },
    });
};

export const getSolapadosService = async (inicio, fin, idExcluir = null) => {
    return prisma.evento.findMany({
        where: { inicio: { lt: fin }, fin: { gt: inicio }, ...(idExcluir !== null ? { id: { not: idExcluir } } : {}) },
        orderBy: { inicio: "asc" },
        take: 5,
    });
};

export const crearEventoService = async (datos) => {
    return prisma.evento.create({ data: datos });
};

export const editarEventoService = async (id, datos) => {
    return prisma.evento.update({
        where: { id },
        data: datos,
    });
};