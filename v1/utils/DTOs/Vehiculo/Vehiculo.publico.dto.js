export class VehiculoPublicoDTO {
    constructor(vehiculo) {
        this.id = vehiculo.id;
        this.marca = vehiculo.marca;
        this.modelo = vehiculo.modelo;
        this.version = vehiculo.version;
        this.anio = vehiculo.anio;
        this.km = vehiculo.km;
        this.combustible = vehiculo.combustible;
        this.caja = vehiculo.caja; //opcional
        this.color = vehiculo.color;//opcional
        this.categoria = vehiculo.categoria?.nombre ?? null;
        this.precio = vehiculo.precio;
        this.moneda = vehiculo.moneda;
        this.estado = vehiculo.estado;
        this.foto_portada = vehiculo.fotos?.[0] ?? null;
        this.cantidad_fotos = vehiculo.fotos?.length ?? 0;
    }
}