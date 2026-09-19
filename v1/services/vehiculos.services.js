import { prisma } from "../../db.js";
import { construirBusqueda } from "../utils/helpers.js";
import { cloudinary } from "../utils/cloudinary.js";

const construirFiltros = ({ estado, marca, categoria_id, busqueda }) => {
    const where = {};
    if (estado) where.estado = estado;
    if (marca) where.marca = { equals: marca, mode: "insensitive" };
    if (categoria_id) where.categoria_id = categoria_id;
    if (busqueda) where.AND = construirBusqueda(busqueda, ["marca", "modelo", "version"]);
    return where;
};

const construirFiltrosPublicos = ({ categoria_id, combustible, precio_max, anio_min, busqueda }) => {
    const where = { estado: { in: ["disponible", "reservado"] } };
    if (categoria_id) where.categoria_id = categoria_id;
    if (combustible) where.combustible = { equals: combustible, mode: "insensitive" };
    if (precio_max) where.precio = { lte: Number(precio_max) };
    if (anio_min) where.anio = { gte: Number(anio_min) };
    if (busqueda) where.AND = construirBusqueda(busqueda, ["marca", "modelo", "version"]);
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

export const getVehiculoPublicoByIdService = async (id) => {
    return prisma.vehiculo.findFirst({
        where: { id, estado: { in: ["disponible", "reservado"] } },
        include: { categoria: true },
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

export const subirFotoService = (buffer) =>
    new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
        { folder: "lemar/vehiculos", resource_type: "image" },
        (error, resultado) => (error ? reject(error) : resolve(resultado.secure_url)),
    );
    stream.end(buffer);
});

const publicIdDesdeUrl = (url) => {
    if (typeof url !== "string" || !url.includes("res.cloudinary.com")) return null;
    const m = url.match(/\/v\d+\/(.+)\.\w+$/);
    return m ? m[1] : null;
};

export const borrarFotosService = async (urls = []) => {
    const ids = urls.map(publicIdDesdeUrl).filter(Boolean);
    if (ids.length === 0) return { borradas: 0 };
    try {
        const r = await cloudinary.api.delete_resources(ids);
        return { borradas: Object.values(r.deleted ?? {}).filter((v) => v === "deleted").length };
    } catch (error) {
        console.error("[fotos] no se pudieron borrar:", ids, error.message);
        return { borradas: 0, error: true };
    }
};

export const limpiarFotosHuerfanasService = async ({ horasDeGracia = 24, soloListar = false } = {}) => {
    const vehiculos = await prisma.vehiculo.findMany({ select: { fotos: true } });
    const referenciadas = new Set(
        vehiculos.flatMap((v) => v.fotos).map(publicIdDesdeUrl).filter(Boolean),
    );

    const limite = Date.now() - horasDeGracia * 60 * 60 * 1000;
    const huerfanas = [];
    let cursor;

    do {
        const pagina = await cloudinary.api.resources({
            type: "upload",
            prefix: "lemar/vehiculos/",
            max_results: 500,
            next_cursor: cursor,
        });
        for (const r of pagina.resources) {
            if (referenciadas.has(r.public_id)) continue;
            if (new Date(r.created_at).getTime() > limite) continue;
            huerfanas.push(r.public_id);
        }
        cursor = pagina.next_cursor;
    } while (cursor);

    if (huerfanas.length && !soloListar) await cloudinary.api.delete_resources(huerfanas);
    return { revisadas: referenciadas.size, huerfanas: huerfanas.length, ids: huerfanas };
};