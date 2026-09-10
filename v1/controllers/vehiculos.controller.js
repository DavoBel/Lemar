import { getPaginacion } from "../utils/helpers.js";
import { VehiculoAdminDTO } from "../utils/DTOs/Vehiculo/Vehiculo.admin.dto.js";
import { VehiculoDetalladoAdminDTO } from "../utils/DTOs/Vehiculo/Vehiculo.detallado.admin.dto.js";
import { getVehiculosService, getVehiculoByIDService } from "../services/vehiculos.services.js";
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