import { getOfertasService } from "../services/oferta.services.js";
import { ofertaToJSON } from "../utils/oferta.mapper.js";

export const obtenerOfertas = async (req, res) =>{
    const ofertas = await getOfertasService();
    const ofertasJSON = ofertas.map(oferta => ofertaToJSON(oferta));
    res.status(200).json(ofertasJSON);
}