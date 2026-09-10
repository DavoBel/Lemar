import { prisma } from "../../db.js";

const construirFiltros = ({ estado, marca, busqueda }) => {
    const where = {};
    if (estado) where.estado = estado;
    if (marca) where.marca = { equals: marca, mode: "insensitive" };
    if (busqueda) {
        where.OR = [
            { marca:   { contains: busqueda, mode: "insensitive" } },
            { modelo:  { contains: busqueda, mode: "insensitive" } },
            { version: { contains: busqueda, mode: "insensitive" } },
        ];
    }
    return where;
};

export const getVehiculosService = async (filtros, limite, skip) => {
    const where = construirFiltros(filtros);
    const [datos, total] = await prisma.$transaction([
        prisma.vehiculo.findMany({
            where,
            include: { categoria: true },
            orderBy: [
                { estado: "asc" },
                { fecha_creacion: "desc" },
                { id: "desc" },
            ],
            skip,
            take: limite,
        }),
        prisma.vehiculo.count({ where }),
    ]);
    return { datos, total };
};