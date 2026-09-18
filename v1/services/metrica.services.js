import { prisma } from "../../db.js";

const ZONA = "America/Montevideo";
const enStock = { estado: { not: "vendido" } };

const sql = {
    stockExtra: () => prisma.$queryRawUnsafe(`
        SELECT
          COALESCE(AVG(EXTRACT(EPOCH FROM (now() - fecha_creacion)) / 86400), 0)::int AS antiguedad_promedio_dias,
          COUNT(*) FILTER (WHERE moneda = 'USD' AND precio <  10000)::int AS hasta_10k,
          COUNT(*) FILTER (WHERE moneda = 'USD' AND precio >= 10000 AND precio < 20000)::int AS de_10_a_20k,
          COUNT(*) FILTER (WHERE moneda = 'USD' AND precio >= 20000 AND precio < 30000)::int AS de_20_a_30k,
          COUNT(*) FILTER (WHERE moneda = 'USD' AND precio >= 30000)::int AS mas_de_30k
        FROM vehiculo WHERE estado <> 'vendido'`),

    ventasMes: () => prisma.$queryRawUnsafe(`
        SELECT
          COUNT(*)::int AS cantidad,
          COALESCE(SUM(precio), 0)::int AS monto,
          COALESCE(SUM(precio - precio_compra) FILTER (WHERE precio_compra IS NOT NULL), 0)::int AS margen,
          COUNT(*) FILTER (WHERE precio_compra IS NULL)::int AS sin_precio_compra
        FROM vehiculo
        WHERE estado = 'vendido'
          AND fecha_vendido AT TIME ZONE '${ZONA}' >= date_trunc('month', now() AT TIME ZONE '${ZONA}')`),

    ventasGlobal: () => prisma.$queryRawUnsafe(`
        SELECT
          COALESCE(AVG(precio - precio_compra) FILTER (WHERE precio_compra IS NOT NULL), 0)::int AS margen_promedio,
          COALESCE(AVG((precio - precio_compra)::numeric / NULLIF(precio, 0) * 100)
                   FILTER (WHERE precio_compra IS NOT NULL), 0)::int AS margen_porcentaje,
          COALESCE(AVG(EXTRACT(EPOCH FROM (fecha_vendido - fecha_creacion)) / 86400), 0)::int AS dias_promedio_venta
        FROM vehiculo WHERE estado = 'vendido' AND fecha_vendido IS NOT NULL`),

    porMes: () => prisma.$queryRawUnsafe(`
        WITH meses AS (
          SELECT generate_series(
            date_trunc('month', now() AT TIME ZONE '${ZONA}') - interval '5 months',
            date_trunc('month', now() AT TIME ZONE '${ZONA}'),
            interval '1 month') AS mes)
        SELECT m.mes,
               COUNT(v.id)::int AS ventas,
               COALESCE(SUM(v.precio - v.precio_compra) FILTER (WHERE v.precio_compra IS NOT NULL), 0)::int AS margen
        FROM meses m
        LEFT JOIN vehiculo v ON v.estado = 'vendido'
          AND date_trunc('month', v.fecha_vendido AT TIME ZONE '${ZONA}') = m.mes
        GROUP BY m.mes ORDER BY m.mes`),

    porSemana: () => prisma.$queryRawUnsafe(`
        WITH semanas AS (
          SELECT generate_series(
            date_trunc('week', now() AT TIME ZONE '${ZONA}') - interval '3 weeks',
            date_trunc('week', now() AT TIME ZONE '${ZONA}'),
            interval '1 week') AS semana)
        SELECT s.semana, COUNT(o.id)::int AS ofertas
        FROM semanas s
        LEFT JOIN oferta o ON date_trunc('week', o.fecha_creacion AT TIME ZONE '${ZONA}') = s.semana
        GROUP BY s.semana ORDER BY s.semana`),

    agenda: () => prisma.$queryRawUnsafe(`
        SELECT tipo::text AS tipo, COUNT(*)::int AS cantidad
        FROM evento
        WHERE inicio AT TIME ZONE '${ZONA}' >= date_trunc('week', now() AT TIME ZONE '${ZONA}')
          AND inicio AT TIME ZONE '${ZONA}' <  date_trunc('week', now() AT TIME ZONE '${ZONA}') + interval '7 days'
        GROUP BY tipo`),
};

export const getResumenMetricasService = async () => {
    const [
        stockTotal, stockPorMoneda, stockPorEstado, stockPorMarca, masAntiguos, stockExtra,
        ventasMes, ventasGlobal, porMes,
        ofertasPorEstado, ofertasTasacion, porSemana,
        historias, agenda,
    ] = await prisma.$transaction([
        prisma.vehiculo.count({ where: enStock }),
        prisma.vehiculo.groupBy({ by: ["moneda"], where: enStock, _sum: { precio: true } }),
        prisma.vehiculo.groupBy({ by: ["estado"], where: enStock, _count: true }),
        prisma.vehiculo.groupBy({ by: ["marca"], where: enStock, _count: true,
                                  orderBy: { _count: { marca: "desc" } } }),
        prisma.vehiculo.findMany({ where: enStock, orderBy: { fecha_creacion: "asc" }, take: 5,
                                   select: { id: true, marca: true, modelo: true, version: true,
                                             precio: true, moneda: true, fecha_creacion: true } }),
        sql.stockExtra(),
        sql.ventasMes(),
        sql.ventasGlobal(),
        sql.porMes(),
        prisma.oferta.groupBy({ by: ["estado"], _count: true }),
        prisma.oferta.aggregate({ _avg: { tasacion_interna: true }, _count: { tasacion_interna: true } }),
        sql.porSemana(),
        prisma.usuario.aggregate({ _sum: { historias: true } }),
        sql.agenda(),
    ]);

    return { stockTotal, stockPorMoneda, stockPorEstado, stockPorMarca, masAntiguos,
             stockExtra: stockExtra[0], ventasMes: ventasMes[0], ventasGlobal: ventasGlobal[0],
             porMes, ofertasPorEstado, ofertasTasacion, porSemana, historias, agenda };
};