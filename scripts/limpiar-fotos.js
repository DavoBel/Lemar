import "dotenv/config";
import { prisma } from "../db.js";
import { limpiarFotosHuerfanasService } from "../v1/services/vehiculos.services.js";

const seco = process.argv.includes("--dry-run");

try {
    const r = await limpiarFotosHuerfanasService({ soloListar: seco });
    console.log(`[limpieza] referenciadas: ${r.revisadas} | huérfanas: ${r.huerfanas}${seco ? " (dry-run, no se borró nada)" : " borradas"}`);
    if (r.ids?.length) for (const id of r.ids) console.log(`   ${id}`);
} catch (error) {
    const detalle = error.error?.message ?? error.message ?? String(error);
    console.error("[limpieza] falló:", detalle);
    process.exitCode = 1;
} finally {
    await prisma.$disconnect();
}