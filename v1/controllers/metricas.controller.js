import { getResumenMetricasService } from "../services/metrica.services.js";

const mes = (d) => d.toLocaleDateString("es-UY", { month: "short" }).replace(".", "");
const dia = (d) => d.toLocaleDateString("es-UY", { day: "2-digit", month: "2-digit" });
const TIPOS = ["visita", "prueba", "tasacion", "entrega", "otro"];
const ESTADOS_OFERTA = ["nueva", "en_revision", "tasada", "rechazada", "aceptada"];

export const obtenerResumen = async (req, res) => {
    const m = await getResumenMetricasService();

    const ofertasPorEstado = Object.fromEntries(m.ofertasPorEstado.map(o => [o.estado, o._count]));
    const aceptadas = ofertasPorEstado.aceptada ?? 0;
    const rechazadas = ofertasPorEstado.rechazada ?? 0;
    const resueltas = aceptadas + rechazadas;
    const agenda = Object.fromEntries(m.agenda.map(a => [a.tipo, a.cantidad]));

    res.status(200).json({
        stock: {
            total: m.stockTotal,
            valor_por_moneda: m.stockPorMoneda.map(x => ({ moneda: x.moneda, valor: x._sum.precio ?? 0 })),
            antiguedad_promedio_dias: m.stockExtra.antiguedad_promedio_dias,
            por_estado: m.stockPorEstado.map(x => ({ estado: x.estado, cantidad: x._count })),
            por_marca: m.stockPorMarca.map(x => ({ marca: x.marca, cantidad: x._count })),
            por_franja: [
                { label: "Hasta U$S 10.000",    cantidad: m.stockExtra.hasta_10k },
                { label: "U$S 10.000 – 20.000", cantidad: m.stockExtra.de_10_a_20k },
                { label: "U$S 20.000 – 30.000", cantidad: m.stockExtra.de_20_a_30k },
                { label: "Más de U$S 30.000",   cantidad: m.stockExtra.mas_de_30k },
            ],
            mas_antiguos: m.masAntiguos,
        },
        ventas: {
            cantidad_mes: m.ventasMes.cantidad,
            monto_mes: m.ventasMes.monto,
            margen_mes: m.ventasMes.margen,
            sin_precio_compra: m.ventasMes.sin_precio_compra,
            margen_promedio: m.ventasGlobal.margen_promedio,
            margen_porcentaje: m.ventasGlobal.margen_porcentaje,
            dias_promedio_venta: m.ventasGlobal.dias_promedio_venta,
            ultimos_meses: m.porMes.map(x => ({ label: mes(x.mes), ventas: x.ventas, margen: x.margen })),
        },
        ofertas: {
            por_estado: ESTADOS_OFERTA.map(e => ({ estado: e, cantidad: ofertasPorEstado[e] ?? 0 })),
            tasa_aceptacion: resueltas ? Math.round((aceptadas / resueltas) * 100) : null,
            tasacion_promedio: Math.round(m.ofertasTasacion._avg.tasacion_interna ?? 0),
            tasadas: m.ofertasTasacion._count.tasacion_interna,
            ultimas_semanas: m.porSemana.map((x, i, a) =>
                ({ label: i === a.length - 1 ? "Esta" : dia(x.semana), ofertas: x.ofertas })),
        },
        historias: { total: m.historias._sum.historias ?? 0 },
        agenda: {
            total_semana: Object.values(agenda).reduce((a, b) => a + b, 0),
            por_tipo: TIPOS.map(t => ({ tipo: t, cantidad: agenda[t] ?? 0 })),
        },
    });
};