export class VehiculoAdminDTO {
    constructor(vehiculo) {
        this.id = vehiculo.id;
        this.marca = vehiculo.marca;
        this.modelo = vehiculo.modelo;
        this.version = vehiculo.version;
        this.anio = vehiculo.anio;
        this.km = vehiculo.km;
        this.patente = vehiculo.patente;
        this.combustible = vehiculo.combustible;
        this.caja = vehiculo.caja;
        this.precio = vehiculo.precio;
        this.moneda = vehiculo.moneda;
        this.foto_portada = vehiculo.fotos?.[0] ?? null;
        this.cantidad_fotos = vehiculo.fotos?.length ?? 0;
        this.estado = vehiculo.estado;
        this.fecha_creacion = vehiculo.fecha_creacion;
    }
}