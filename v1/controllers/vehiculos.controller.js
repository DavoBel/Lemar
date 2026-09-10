import { getPaginacion } from "../utils/helpers.js";
import { VehiculoAdminDTO } from "../utils/DTOs/Vehiculo/Vehiculo.admin.dto.js";
import { getVehiculosService } from "../services/vehiculos.services.js";

export const obtenerVehiculos = async (req, res) => {
    const { limite, pagina, skip } = getPaginacion(req);
    const { estado, marca, busqueda } = req.query;
    const filtros = { estado, marca, busqueda }

    const { datos, total } = await getVehiculosService(filtros, limite, skip);

    res.status(200).json({
        datos: datos.map((v) => new VehiculoAdminDTO(v)),
        total,
        pagina,
        paginas: Math.ceil(total / limite),
    });
};