import {prisma} from "../../db.js"

const construirFiltros = ({ estado, busqueda }) => {
    const where = {};
    if (estado) where.estado = estado;
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