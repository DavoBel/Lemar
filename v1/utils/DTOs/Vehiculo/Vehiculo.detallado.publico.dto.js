export class VehiculoDetalladoPublicoDTO {
    constructor(vehiculo) {
        this.id = vehiculo.id;
        this.marca = vehiculo.marca;
        this.modelo = vehiculo.modelo;
        this.version = vehiculo.version;
        this.anio = vehiculo.anio;
        this.km = vehiculo.km;
        this.combustible = vehiculo.combustible;
        this.caja = vehiculo.caja;
        this.color = vehiculo.color;
        this.motor = vehiculo.motor;
        this.consumo = vehiculo.consumo;
        this.potencia = vehiculo.potencia;
        this.caracteristicas = vehiculo.caracteristicas;
        this.categoria = vehiculo.categoria?.nombre ?? null;
        this.precio = vehiculo.precio;
        this.moneda = vehiculo.moneda;
        this.descripcion = vehiculo.descripcion;
        this.fotos = vehiculo.fotos;
        this.estado = vehiculo.estado;
        this.fecha_creacion = vehiculo.fecha_creacion;
    }
}