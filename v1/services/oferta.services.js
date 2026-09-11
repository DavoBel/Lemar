import {prisma} from "../../db.js"
import { construirBusqueda } from "../utils/helpers.js"

const construirFiltros = ({ estado, busqueda }) => {
    const where = {};
    if (estado) where.estado = estado;
    if (busqueda) where.AND = construirBusqueda(busqueda, ["marca", "modelo", "version"]);
    return where;
};

const ORDENES = {
    fecha_desc: [{ fecha_creacion: "desc" }, { id: "desc" }],
    fecha_asc:  [{ fecha_creacion: "asc"  }, { id: "desc" }],
    estado:     [{ estado: "asc" }, { fecha_creacion: "desc" }, { id: "desc" }],
};


export const getOfertasService = async (filtros, orden, limite, skip) => {
    const where = construirFiltros(filtros);
    const [datos, total, nuevas] = await prisma.$transaction([
        prisma.oferta.findMany({ where, orderBy: ORDENES[orden] ?? ORDENES.fecha_desc, skip, take: limite }),
        prisma.oferta.count({ where }),
        prisma.oferta.count({ where: { estado: "nueva" } }),
    ]);
    return { datos, total, nuevas };
};

export const getOfertaByIdService = (id) =>{
    return prisma.oferta.findUnique({ where: { id } });
}

export const editarEstadoOfertaService = async (id, estado) => {
    return prisma.oferta.update({ where: { id }, data: { estado } });
};

export const editarTasacionService = async (id, datos) => {
    return await prisma.oferta.update({ where: { id }, data: datos });
};