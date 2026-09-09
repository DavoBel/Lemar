import { prisma } from "../../db.js";

export const getCategorias = async () => {
    const categorias = await prisma.categoria.findMany();
    /*
        No use orderBy: { nombre: "asc" } porque la base usa la collation C.UTF-8, que ordena por valor de byte y pone las mayúsculas
        antes que las minúsculas, con orderBy de Prisma, SUV quedaría antes que Sedán. Por eso se ordena en JavaScript.
    */
    return categorias.sort((a, b) => a.nombre.localeCompare(b.nombre, "es")); 
}