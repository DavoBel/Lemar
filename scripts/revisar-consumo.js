import "dotenv/config";
import { cloudinary } from "../v1/utils/cloudinary.js";

const UMBRAL = Number(process.env.UMBRAL_CONSUMO ?? 60);
const gb = (bytes) => (bytes / 1024 ** 3).toFixed(2);

try {
    const u = await cloudinary.api.usage();
    const pct = u.credits.used_percent;

    console.log(`[consumo] plan ${u.plan} — ${u.credits.usage} de ${u.credits.limit} créditos (${pct}%)`);
    console.log(`          almacenamiento: ${gb(u.storage.usage)} GB (${u.storage.credits_usage} créditos)`);
    console.log(`          tráfico:        ${gb(u.bandwidth.usage)} GB (${u.bandwidth.credits_usage} créditos)`);
    console.log(`          archivos:       ${u.resources}`);

    if (pct >= UMBRAL) {
        console.error(`[consumo] SUPERA EL UMBRAL de ${UMBRAL}%.`);
        console.error(`          Revisar: carga diferida de las fotos del carrusel y tamaño de detalle.`);
        process.exitCode = 1;
    }
} catch (error) {
    const detalle = error.error?.message ?? error.message ?? String(error);
    console.error(`[consumo] falló la consulta: ${detalle}`);
    process.exitCode = 1;
}