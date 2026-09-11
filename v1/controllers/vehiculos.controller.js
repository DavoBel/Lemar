import { getPaginacion } from "../utils/helpers.js";
import { VehiculoAdminDTO } from "../utils/DTOs/Vehiculo/Vehiculo.admin.dto.js";
import { VehiculoDetalladoAdminDTO } from "../utils/DTOs/Vehiculo/Vehiculo.detallado.admin.dto.js";
import { VehiculoPublicoDTO } from "../utils/DTOs/Vehiculo/Vehiculo.publico.dto.js";
import { 
    getVehiculosService, 
    getVehiculoByIDService, 
    agregarVehiculoService, 
    editarVehiculoService, 
    eliminarVehiculoService, 
    getVehiculosPublicosService 
} from "../services/vehiculos.services.js";
import { getCategoriaXIdService } from "../services/categoria.services.js";
import { AppError } from "../utils/AppError.js";


export const obtenerVehiculos = async (req, res) => {
    const { limite, pagina, skip } = getPaginacion(req);
    const { estado, marca, categoria_id, busqueda } = req.query;
    const filtros = { estado, marca, categoria_id, busqueda };

    const { datos, total } = await getVehiculosService(filtros, limite, skip);

    res.status(200).json({
        datos: datos.map((v) => new VehiculoAdminDTO(v)),
        total,
        pagina,
        paginas: Math.ceil(total / limite),
    });
};

export const obtenerVehiculoID = async (req, res) => {
    const { id } = req.params;
    const vehiculo = await getVehiculoByIDService(id);
    if (!vehiculo) throw new AppError(404, "No se encontró el vehículo.");
    res.status(200).json(new VehiculoDetalladoAdminDTO(vehiculo));
};

export const agregarVehiculo = async (req, res) => {
    const datos = req.validatedBody;
    const categoria = await getCategoriaXIdService(datos.categoria_id);
    if (!categoria) throw new AppError(400, "La categoría seleccionada no existe.");
    datos.estado = "disponible";
    const vehiculo = await agregarVehiculoService(datos);
    res.status(201).json(new VehiculoDetalladoAdminDTO(vehiculo));
};

export const editarVehiculo = async (req, res) => {
    const { id } = req.params;
    const actual = await getVehiculoByIDService(id);
    if (!actual) throw new AppError(404, "No se encontró el vehículo.");
    const datos = {};
    for (const clave of Object.keys(req.body)) {
        if (clave in req.validatedBody) datos[clave] = req.validatedBody[clave]; // para borrar atributos con "" que los coloca el .default del schema del alta.
    }
    if (Object.keys(datos).length === 0) {
        throw new AppError(400, "No se envió ningún campo para modificar.");
    }
    if (datos.estado === "vendido" && actual.estado !== "vendido")datos.fecha_vendido = new Date();
    if (datos.estado && datos.estado !== "vendido" && actual.estado === "vendido")datos.fecha_vendido = null;
    if (datos.categoria_id && datos.categoria_id !== actual.categoria_id) {
        const categoria = await getCategoriaXIdService(datos.categoria_id);
        if (!categoria) throw new AppError(400, "La categoría seleccionada no existe.");
    }
    const vehiculo = await editarVehiculoService(id, datos);
    res.status(200).json(new VehiculoDetalladoAdminDTO(vehiculo));
};

export const eliminarVehiculo = async (req, res) => {
    const { id } = req.params;
    const vehiculo = await getVehiculoByIDService(id);
    if (!vehiculo) throw new AppError(404, "No se encontró el vehículo.");
    if (vehiculo.estado === "vendido") {
        throw new AppError(409, "No se puede borrar un vehículo vendido: se perdería el historial de ventas.");
    }
    await eliminarVehiculoService(id);
    res.status(204).send();
};

export const obtenerVehiculosPublicos = async (req, res) => {
    const { limite, pagina, skip } = getPaginacion(req, 10);
    const { categoria_id, combustible, precio_max, anio_min, busqueda, orden } = req.query;

    const { datos, total } = await getVehiculosPublicosService(
        { categoria_id, combustible, precio_max, anio_min, busqueda }, orden, limite, skip
    );

    res.status(200).json({
        datos: datos.map((v) => new VehiculoPublicoDTO(v)),
        total,
        pagina,
        paginas: Math.ceil(total / limite),
    });
};