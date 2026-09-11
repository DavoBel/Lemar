import { getOfertasService } from "../services/oferta.services.js";
import { ofertaToJSON } from "../utils/oferta.mapper.js";
import { getPaginacion } from "../utils/helpers.js";

export const obtenerOfertas = async (req, res) =>{
    const { limite, pagina, skip } = getPaginacion(req);
    const { estado, busqueda, orden } = req.query;

    const { datos, total, nuevas } = await getOfertasService({ estado, busqueda }, orden, limite, skip);

    res.status(200).json({
        datos: datos.map(ofertaToJSON),
        total,
        pagina,
        paginas: Math.ceil(total / limite),
        nuevas,
    });
}