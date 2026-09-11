import { getOfertasService, editarEstadoOfertaService, getOfertaByIdService, editarTasacionService, crearOfertaService } from "../services/oferta.services.js";
import { AppError } from "../utils/AppError.js";
import { ofertaToJSON } from "../utils/oferta.mapper.js";
import { getPaginacion } from "../utils/helpers.js";
import { ofertaFromJSON } from "../utils/oferta.mapper.js";

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

export const editarEstadoOferta = async (req, res) => {
    const { id } = req.params;
    const actual = await getOfertaByIdService(id);
    if (!actual) throw new AppError(404, "No se encontró la oferta.");
    const oferta = await editarEstadoOfertaService(id, req.validatedBody.estado);
    res.status(200).json(ofertaToJSON(oferta));
};

export const editarTasacion = async (req, res) => {
    const { id } = req.params;
    const { valor, nota } = req.validatedBody;
    const datos = {
        tasacion_interna: valor,
        nota_interna: nota === "" ? null : nota,
    };
    const actual = await getOfertaByIdService(id);
    if (!actual) throw new AppError(404, "No se encontró la oferta.");
    const oferta = await editarTasacionService(id, datos);

    res.status(200).json(ofertaToJSON(oferta));
};

export const agregarOfertaPublica = async (req, res) => {
    const { empresa, ...campos } = req.validatedBody;
    if (empresa) return res.status(201).json({ ok: true });

    const datos = ofertaFromJSON(campos);
    await crearOfertaService(datos);

    res.status(201).json({ ok: true });
};