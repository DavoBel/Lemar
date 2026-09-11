import { prisma } from "../../db.js";

const construirFiltros = ({ estado, marca, categoria_id, busqueda }) => {
    const where = {};
    if (estado) where.estado = estado;
    if (marca) where.marca = { equals: marca, mode: "insensitive" };
    if (categoria_id) where.categoria_id = categoria_id;
    if (busqueda) {
        where.OR = [
            { marca:   { contains: busqueda, mode: "insensitive" } },
            { modelo:  { contains: busqueda, mode: "insensitive" } },
            { version: { contains: busqueda, mode: "insensitive" } },
        ];
    }
    return where;
};

const construirFiltrosPublicos = ({ categoria_id, combustible, precio_max, anio_min, busqueda }) => {
    const where = { estado: { in: ["disponible", "reservado"] } };
    if (categoria_id) where.categoria_id = categoria_id;
    if (combustible) where.combustible = { equals: combustible, mode: "insensitive" };
    if (precio_max) where.precio = { lte: Number(precio_max) };
    if (anio_min) where.anio = { gte: Number(anio_min) };
    if (busqueda) {
        where.OR = [
            { marca:   { contains: busqueda, mode: "insensitive" } },
            { modelo:  { contains: busqueda, mode: "insensitive" } },
            { version: { contains: busqueda, mode: "insensitive" } },
        ];
    }
    return where;
};

const ORDENES = {
    precio_asc:  [{ precio: "asc" },          { id: "desc" }],
    precio_desc: [{ precio: "desc" },         { id: "desc" }],
    anio_desc:   [{ anio: "desc" },           { id: "desc" }],
    recientes:   [{ fecha_creacion: "desc" }, { id: "desc" }],
};

export const getVehiculosService = async (filtros, limite, skip) => {
    const where = construirFiltros(filtros);
    const [datos, total] = await prisma.$transaction([
        prisma.vehiculo.findMany({
            where,
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

export const getVehiculosPublicosService = async (filtros, orden, limite, skip) => {
    const where = construirFiltrosPublicos(filtros);
    const [datos, total] = await prisma.$transaction([
        prisma.vehiculo.findMany({
            where,
            include: { categoria: true },
            orderBy: ORDENES[orden] ?? ORDENES.recientes,
            skip,
            take: limite,
        }),
        prisma.vehiculo.count({ where }),
    ]);
    return { datos, total };
};

export const getVehiculoByIDService = async (id) => {
    return await prisma.vehiculo.findUnique({
        where: {id}, 
        include:{categoria:true}
    });
};

export const agregarVehiculoService = async (datos) => {
    return prisma.vehiculo.create({
        data: datos,
        include: { categoria: true },
    });
};

export const editarVehiculoService = async (id, datos) => {
    return prisma.vehiculo.update({
        where: { id },
        data: datos,
        include: { categoria: true },
    });
};

export const eliminarVehiculoService = async (id) => {
    await prisma.vehiculo.delete({ where: { id } });
};

