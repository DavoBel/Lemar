import { AppError } from '../utils/AppError.js';
import { getRangoFechas } from '../utils/helpers.js';
import { getEventosService, getSolapadosService, crearEventoService } from '../services/evento.service.js';

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
    const solapamientos = await getSolapadosService(datos.inicio, datos.fin);
    const evento = await crearEventoService(datos);
    res.status(201).json({ evento, solapamientos });
};

