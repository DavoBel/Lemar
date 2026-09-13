import { AppError } from '../utils/AppError.js';
import { getRangoFechas } from '../utils/helpers.js';
import { getEventosService, getSolapadosService, crearEventoService, editarEventoService, getEventoByIdService } from '../services/evento.service.js';

export const getEventos = async (req, res, next) => {
    const { desde: crudoDesde, hasta: crudoHasta } = req.query;
    if (crudoDesde && isNaN(Date.parse(crudoDesde))) throw new AppError(400, "El parámetro desde no es una fecha válida.");
    if (crudoHasta && isNaN(Date.parse(crudoHasta))) throw new AppError(400, "El parámetro hasta no es una fecha válida.");
    const { desde, hasta } = getRangoFechas(req);
    const dias = Math.round((hasta - desde) / (1000 * 60 * 60 * 24));
    if(dias>365) throw new AppError(400, "El rango de fechas no puede ser mayor a 365 días.");
    if (hasta <= desde) throw new AppError(400, "El parámetro hasta debe ser posterior a desde.");
    const eventos = await getEventosService(desde, hasta);
    res.status(200).json(eventos);
};

export const crearEvento = async (req, res) => {
    const datos = req.validatedBody;
    const solapamientos = await getSolapadosService(datos.inicio, datos.fin, null);
    const evento = await crearEventoService(datos);
    res.status(201).json({ evento, solapamientos });
};

export const editarEvento = async (req, res) => {
    const { id } = req.params;
    const actual = await getEventoByIdService(id);
    if (!actual) throw new AppError(404, "No se encontró el evento.");
    const datos = {};
    for (const clave of Object.keys(req.body)) {
        if (clave in req.validatedBody) datos[clave] = req.validatedBody[clave];
    }
    if (Object.keys(datos).length === 0) {
        throw new AppError(400, "No se envió ningún campo para modificar.");
    }
    const inicioFinal = datos.inicio ?? actual.inicio;
    const finFinal = datos.fin ?? actual.fin;
    if (finFinal <= inicioFinal)throw new AppError(400, "El fin tiene que ser posterior al inicio.");
    const solapamientos = await getSolapadosService(inicioFinal, finFinal, id);
    const evento = await editarEventoService(id, datos);
    res.status(200).json({ evento, solapamientos });
};