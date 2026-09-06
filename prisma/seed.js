import "dotenv/config";

import bcrypt from "bcryptjs";

import { prisma } from "../db.js";

const PASSWORD_DEMO = "lemar1234";

function diasAtras(dias, hora = 10, minuto = 0) {
  const d = new Date();
  d.setDate(d.getDate() - dias);
  d.setHours(hora, minuto, 0, 0);
  return d;
}

function enDias(dias, hora = 10, minuto = 0) {
  const d = new Date();
  d.setDate(d.getDate() + dias);
  d.setHours(hora, minuto, 0, 0);
  return d;
}

function fotos(slug, archivos) {
  return archivos.map((a) => `/autos/${slug}/${a}`);
}

const CATEGORIAS = [
  "Hatchback",
  "Sedán",
  "SUV",
  "Camioneta",
  "Coupé",
  "Familiar",
  "Van",
  "Utilitario",
];

const USUARIOS = [
  { id: "usr-martin", email: "martin@lemar.com.uy", nombre_completo: "Martín Viacava", rol: "admin", activo: true, historias: 4, dias: 365 },
  { id: "usr-leandro", email: "leandro@lemar.com.uy", nombre_completo: "Leandro Martínez", rol: "empleado", activo: true, historias: 3, dias: 300 },
  { id: "usr-sofia", email: "ventas@lemar.com.uy", nombre_completo: "Sofía Ramos", rol: "empleado", activo: true, historias: 2, dias: 210 },
  { id: "usr-bruno", email: "admin2@lemar.com.uy", nombre_completo: "Bruno Castillo", rol: "admin", activo: true, historias: 1, dias: 140 },
  { id: "usr-camila", email: "pasante@lemar.com.uy", nombre_completo: "Camila Duarte", rol: "empleado", activo: false, historias: 0, dias: 75 },
];

function ventaVieja(id, marca, modelo, anio, patente, precio, precioCompra, dias) {
  return {
    id,
    marca,
    modelo,
    version: "",
    anio,
    km: 0,
    patente,
    combustible: "Nafta",
    caja: "Manual",
    color: "",
    motor: "",
    consumo: "",
    potencia: "",
    caracteristicas: [],
    categoria: "Hatchback",
    precio,
    precio_compra: precioCompra,
    moneda: "USD",
    descripcion: "",
    fotos: [],
    estado: "vendido",
    fecha_creacion: diasAtras(dias + 55),
    fecha_modificacion: diasAtras(dias),
    fecha_vendido: diasAtras(dias),
  };
}

const VEHICULOS = [
  {
    id: "veh-tiguan",
    marca: "Volkswagen",
    modelo: "Tiguan",
    version: "Allspace Life 1.4 TSI",
    anio: 2021,
    km: 48000,
    patente: "SBA 3402",
    combustible: "Nafta",
    caja: "Automática",
    color: "Blanco",
    motor: "1.4 TSI",
    consumo: "7.8 L/100km",
    potencia: "150 CV",
    caracteristicas: [
      "7 asientos",
      "Cámara de retroceso",
      "Sensores de estacionamiento",
      "Climatizador bizona",
      "Apple CarPlay",
      'Llantas de aleación 18"',
    ],
    categoria: "SUV",
    precio: 38900,
    precio_compra: 33500,
    moneda: "USD",
    descripcion:
      "Único dueño, service oficial al día. Impecable estado general, sin detalles de chapa ni pintura. Permuto por menor valor.",
    fotos: fotos("volkswagen-tiguan", ["frente.jpg", "frente-2.jpg", "atras.jpg", "atras-2.jpg", "interior.jpg"]),
    estado: "disponible",
    fecha_creacion: diasAtras(12),
    fecha_modificacion: diasAtras(3),
    fecha_vendido: null,
  },
  {
    id: "veh-jimny",
    marca: "Suzuki",
    modelo: "Jimny",
    version: "GL 1.5 AllGrip",
    anio: 2022,
    km: 31500,
    patente: "SBG 1755",
    combustible: "Nafta",
    caja: "Manual",
    color: "Verde",
    motor: "1.5 VVT",
    consumo: "8.5 L/100km",
    potencia: "102 CV",
    caracteristicas: ["Tracción 4x4", "Control de descenso", "Bluetooth", "Aire acondicionado"],
    categoria: "SUV",
    precio: 29900,
    precio_compra: 25800,
    moneda: "USD",
    descripcion:
      "Muy poco uso, siempre en garage. Ideal para ciudad y salidas de fin de semana. Documentación al día.",
    fotos: fotos("suzuki-jimny", ["frente.jpg", "frente-2.jpg", "atras.jpg", "atras-2.jpg", "interior.jpg"]),
    estado: "disponible",
    fecha_creacion: diasAtras(8),
    fecha_modificacion: diasAtras(8),
    fecha_vendido: null,
  },
  {
    id: "veh-golf",
    marca: "Volkswagen",
    modelo: "Golf",
    version: "GTI 2.0 TSI DSG",
    anio: 2018,
    km: 72400,
    patente: "SAF 8290",
    combustible: "Nafta",
    caja: "Automática",
    color: "Gris",
    motor: "2.0 TSI",
    consumo: "9.2 L/100km",
    potencia: "230 CV",
    caracteristicas: ["Butacas deportivas", "Techo panorámico", "Faros LED", "Levas al volante", "Cuero"],
    categoria: "Hatchback",
    precio: 27500,
    precio_compra: 23200,
    moneda: "USD",
    descripcion:
      "GTI original, no replica. Cubiertas nuevas, embrague DSG con service hecho. Se entrega con dos juegos de llaves.",
    fotos: fotos("volkswagen-golf-gti", ["frente.png", "frente-2.jpg", "atras.png", "atras-2.jpg", "interior.png"]),
    estado: "reservado",
    fecha_creacion: diasAtras(21),
    fecha_modificacion: diasAtras(2),
    fecha_vendido: null,
  },
  {
    id: "veh-onix",
    marca: "Chevrolet",
    modelo: "Onix",
    version: "LT 1.0 Turbo",
    anio: 2020,
    km: 55200,
    patente: "SBB 6134",
    combustible: "Nafta",
    caja: "Manual",
    color: "Rojo",
    motor: "1.0 Turbo",
    consumo: "6.4 L/100km",
    potencia: "116 CV",
    caracteristicas: ['Pantalla táctil 8"', "Android Auto", "Control de estabilidad", "Airbags laterales"],
    categoria: "Hatchback",
    precio: 15800,
    precio_compra: 13100,
    moneda: "USD",
    descripcion:
      "Muy económico de mantener. Motor turbo con excelente consumo. Ideal primer auto o para trabajo con app.",
    fotos: fotos("chevrolet-onix", ["frente.jpg", "frente-2.jpg", "atras.jpg", "atras-2.jpg", "interior.jpg"]),
    estado: "disponible",
    fecha_creacion: diasAtras(30),
    fecha_modificacion: diasAtras(15),
    fecha_vendido: null,
  },
  {
    id: "veh-clio",
    marca: "Renault",
    modelo: "Clio",
    version: "Mío Expression 1.2",
    anio: 2014,
    km: 96500,
    patente: "SAB 2907",
    combustible: "Nafta",
    caja: "Manual",
    color: "Blanco",
    motor: "1.2 16V",
    consumo: "6.1 L/100km",
    potencia: "76 CV",
    caracteristicas: ["Aire acondicionado", "Cierre centralizado"],
    categoria: "Hatchback",
    precio: 7900,
    precio_compra: 6400,
    moneda: "USD",
    descripcion:
      "Muy bajo consumo, ideal ciudad. Empadronado al día, libre de multas. Financiación disponible.",
    fotos: fotos("renault-clio", ["frente.png", "frente-2.png", "atras.png", "atras-2.png"]),
    estado: "disponible",
    fecha_creacion: diasAtras(60),
    fecha_modificacion: diasAtras(38),
    fecha_vendido: null,
  },
  {
    id: "veh-tiida",
    marca: "Nissan",
    modelo: "Tiida",
    version: "Sense 1.8",
    anio: 2015,
    km: 118000,
    patente: "SAD 4418",
    combustible: "Nafta",
    caja: "Manual",
    color: "Gris",
    motor: "1.8 16V",
    consumo: "7.9 L/100km",
    potencia: "126 CV",
    caracteristicas: ["Aire acondicionado", "Dirección asistida", "Alarma"],
    categoria: "Hatchback",
    precio: 11200,
    precio_compra: 9200,
    moneda: "USD",
    descripcion:
      "Mecánica sana, muy espacioso. Se hizo correa de distribución y cubiertas hace 10.000 km.",
    fotos: fotos("nissan-tiida", ["frente.jpg", "frente-2.jpg", "atras.jpg", "atras-2.jpg", "interior.jpg"]),
    estado: "vendido",
    fecha_creacion: diasAtras(45),
    fecha_modificacion: diasAtras(3),
    fecha_vendido: diasAtras(3),
  },
  {
    id: "veh-207",
    marca: "Peugeot",
    modelo: "207",
    version: "Compact Allure 1.4",
    anio: 2013,
    km: 134000,
    patente: "SAA 7763",
    combustible: "Nafta",
    caja: "Manual",
    color: "Negro",
    motor: "1.4 8V",
    consumo: "6.8 L/100km",
    potencia: "82 CV",
    caracteristicas: ["Aire acondicionado", "Levantavidrios eléctricos"],
    categoria: "Hatchback",
    precio: 8400,
    precio_compra: 6900,
    moneda: "USD",
    descripcion: "Vendido el mes pasado. Se mantiene la ficha como referencia.",
    fotos: fotos("peugeot-207", ["frente.jpg", "frente2.jpg", "atras.jpg", "atras-2.jpg", "interior.jpg"]),
    estado: "vendido",
    fecha_creacion: diasAtras(90),
    fecha_modificacion: diasAtras(41),
    fecha_vendido: diasAtras(41),
  },
  ventaVieja("veh-h1", "Fiat", "Argo", 2019, "SBC 9021", 14500, 12300, 35),
  ventaVieja("veh-h2", "Renault", "Sandero", 2019, "SAE 5580", 11400, 9900, 96),
  ventaVieja("veh-h3", "Peugeot", "208", 2020, "SBD 1246", 15900, 13800, 128),
];

const OFERTAS = [
  {
    id: "of-1", marca: "Toyota", modelo: "Corolla", version: "XEI 1.8 CVT", anio: 2017, km: 89000,
    patente: "SAB 4821", combustible: "Nafta", caja: "Automática", color: "Gris", motor: "1.8 16V",
    choques: "no", desperfectos: "Ninguno, anda perfecto.", accesorios: "Cubiertas nuevas, alfombras de goma.",
    titularidad_propia: true, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: false, duenos: 1, nombre: "Sebastián Olivera", telefono: "099 204 776",
    estado: "tasada", dias: 6,
    tasacion_interna: 16500,
    nota_interna: "Revisado en taller. Muy buen estado, se puede ofrecer hasta 17.000 si cierra rápido.",
  },
  {
    id: "of-2", marca: "Fiat", modelo: "Cronos", version: "Drive 1.3", anio: 2020, km: 42000,
    patente: "SBC 1147", combustible: "Nafta", caja: "Manual", color: "Blanco", motor: "1.3 Firefly",
    choques: "no", desperfectos: "Un rayón en la puerta trasera derecha.", accesorios: "Barras de techo.",
    titularidad_propia: true, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: false, duenos: 1, nombre: "Valentina Suárez", telefono: "094 118 552",
    estado: "nueva", dias: 1,
    tasacion_interna: null,
    nota_interna: null,
  },
  {
    id: "of-3", marca: "Ford", modelo: "EcoSport", version: "Titanium 2.0", anio: 2016, km: 112000,
    patente: "SAA 9032", combustible: "Nafta", caja: "Automática", color: "Negro", motor: "2.0 Duratec",
    choques: "menores", desperfectos: "Aire acondicionado carga poco. Tapizado con desgaste.", accesorios: "Estribos, cobertor de baúl.",
    titularidad_propia: true, vtv_al_dia: false, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: true, duenos: 2, nombre: "Diego Fernández", telefono: "099 887 410",
    estado: "tasada", dias: 9,
    tasacion_interna: 12200,
    nota_interna: "Hay que hacerle el aire y VTV. Descontado eso, no pagamos más de 12.200.",
  },
  {
    id: "of-4", marca: "Chevrolet", modelo: "Spin", version: "LTZ 1.8", anio: 2018, km: 78500,
    patente: "SBD 7710", combustible: "Nafta", caja: "Manual", color: "Plata", motor: "1.8 8V",
    choques: "no", desperfectos: "Nada para declarar.", accesorios: "7 asientos, pantalla original.",
    titularidad_propia: false, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: false, duenos: 2, nombre: "Andrés Lema", telefono: "091 335 208",
    estado: "en_revision", dias: 3,
    tasacion_interna: null,
    nota_interna: null,
  },
  {
    id: "of-5", marca: "Volkswagen", modelo: "Gol", version: "Trend 1.6", anio: 2015, km: 134000,
    patente: "SAC 2288", combustible: "Nafta", caja: "Manual", color: "Rojo", motor: "1.6 8V",
    choques: "menores", desperfectos: "Golpe en paragolpes delantero, ya reparado.", accesorios: "Equipo de música.",
    titularidad_propia: true, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: false, duenos: 3, nombre: "Lucía Barreiro", telefono: "099 640 173",
    estado: "aceptada", dias: 22,
    tasacion_interna: 11800,
    nota_interna: "Aceptado como parte de pago del Onix. Operación cerrada.",
  },
  {
    id: "of-6", marca: "Hyundai", modelo: "Tucson", version: "GLS 2.0", anio: 2019, km: 61000,
    patente: "SBB 5504", combustible: "Diésel", caja: "Automática", color: "Azul", motor: "2.0 CRDi",
    choques: "no", desperfectos: "Service oficial al día, sin detalles.", accesorios: "Cámara 360, techo panorámico.",
    titularidad_propia: true, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "prenda",
    tiene_multas: false, duenos: 1, nombre: "Rodrigo Píriz", telefono: "098 442 901",
    estado: "tasada", dias: 4,
    tasacion_interna: 24000,
    nota_interna: "Muy buena unidad, pero tiene prenda: el valor sale recién cuando se levante.",
  },
  {
    id: "of-7", marca: "Renault", modelo: "Duster", version: "Dynamique 1.6", anio: 2017, km: 98000,
    patente: "SAD 6619", combustible: "Nafta", caja: "Manual", color: "Gris", motor: "1.6 16V",
    choques: "importantes", desperfectos: "Chocado de atrás, se cambió el portón. Tren trasero con ruido.", accesorios: "Ninguno.",
    titularidad_propia: false, vtv_al_dia: false, documentacion_completa: false, deuda_prenda: "deuda",
    tiene_multas: true, duenos: 3, nombre: "Gabriel Nuñez", telefono: "092 700 316",
    estado: "rechazada", dias: 14,
    tasacion_interna: 6500,
    nota_interna: "Chocado de atrás y con deuda. Sólo a este precio, y avisando que no lo tomamos en permuta.",
  },
  {
    id: "of-8", marca: "Kia", modelo: "Cerato", version: "EX 1.6", anio: 2021, km: 28000,
    patente: "SBE 3390", combustible: "Nafta", caja: "Automática", color: "Blanco", motor: "1.6 GDI",
    choques: "no", desperfectos: "Impecable, como nuevo.", accesorios: "Polarizado, sensores de estacionamiento.",
    titularidad_propia: true, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: false, duenos: 1, nombre: "Florencia Cabrera", telefono: "099 512 084",
    estado: "aceptada", dias: 31,
    tasacion_interna: 21500,
    nota_interna: "Cerrado en 21.500. Se entrega la semana que viene.",
  },
  {
    id: "of-9", marca: "Peugeot", modelo: "Partner", version: "Confort 1.6", anio: 2014, km: 156000,
    patente: "SAB 1176", combustible: "Diésel", caja: "Manual", color: "Blanco", motor: "1.6 HDi",
    choques: "menores", desperfectos: "Uso de reparto, chapa con abolladuras. Embrague duro.", accesorios: "Estantería en la caja.",
    titularidad_propia: true, vtv_al_dia: false, documentacion_completa: false, deuda_prenda: "ambas",
    tiene_multas: true, duenos: 2, nombre: "Marcelo Duarte", telefono: "094 209 663",
    estado: "rechazada", dias: 26,
    tasacion_interna: 4800,
    nota_interna: "Utilitario muy usado, con deuda y prenda. No conviene, se rechaza.",
  },
  {
    id: "of-10", marca: "Nissan", modelo: "Kicks", version: "Advance 1.6", anio: 2020, km: 47000,
    patente: "SBF 8845", combustible: "Nafta", caja: "Automática", color: "Naranja", motor: "1.6 16V",
    choques: "no", desperfectos: "Sin detalles.", accesorios: "Llantas de aleación, Android Auto.",
    titularidad_propia: true, vtv_al_dia: true, documentacion_completa: true, deuda_prenda: "no",
    tiene_multas: false, duenos: 1, nombre: "Paula Rivero", telefono: "099 073 428",
    estado: "nueva", dias: 0,
    tasacion_interna: null,
    nota_interna: null,
  },
];

const EVENTOS = [
  { id: "ev-1", tipo: "prueba", cliente: "Martín Rodríguez", telefono: "099 412 887", vehiculo: "Volkswagen Tiguan Allspace 2021", dias: 0, hora: 10, minuto: 30, duracion: 60, nota: "Quiere probarla en ruta. Confirmó por WhatsApp." },
  { id: "ev-2", tipo: "visita", cliente: "Carolina Méndez", telefono: "094 771 203", vehiculo: "Suzuki Jimny GL 2022", dias: 0, hora: 15, minuto: 0, duracion: 45, nota: "Viene con el marido a verlo." },
  { id: "ev-3", tipo: "tasacion", cliente: "Sebastián Olivera", telefono: "099 204 776", vehiculo: "Toyota Corolla XEI 2017", dias: 1, hora: 9, minuto: 0, duracion: 45, nota: "Trae el auto para tasar. Revisar cubiertas y service." },
  { id: "ev-4", tipo: "entrega", cliente: "Lucía Barreiro", telefono: "099 640 173", vehiculo: "Chevrolet Onix LT 2020", dias: 1, hora: 16, minuto: 30, duracion: 60, nota: "Entrega con permuta del Gol. Tener la documentación pronta." },
  { id: "ev-5", tipo: "prueba", cliente: "Federico Antúnez", telefono: "091 556 340", vehiculo: "Volkswagen Golf GTI 2018", dias: 2, hora: 11, minuto: 0, duracion: 60, nota: "Está reservado, avisar que es sólo para conocerlo." },
  { id: "ev-6", tipo: "visita", cliente: "Natalia Gómez", telefono: "098 330 172", vehiculo: "Renault Clio Mío 2014", dias: 3, hora: 14, minuto: 0, duracion: 30, nota: "Consultó por financiación." },
  { id: "ev-7", tipo: "tasacion", cliente: "Rodrigo Píriz", telefono: "098 442 901", vehiculo: "Hyundai Tucson GLS 2019", dias: 4, hora: 10, minuto: 0, duracion: 45, nota: "Tiene prenda. Pedir papeles del banco." },
  { id: "ev-8", tipo: "entrega", cliente: "Florencia Cabrera", telefono: "099 512 084", vehiculo: "Kia Cerato EX 2021", dias: 6, hora: 12, minuto: 0, duracion: 60, nota: "Compra cerrada, resta firmar." },
  { id: "ev-9", tipo: "visita", cliente: "Joaquín Silva", telefono: "092 884 019", vehiculo: "Chevrolet Onix LT 2020", dias: -2, hora: 17, minuto: 0, duracion: 30, nota: "Vino, le gustó. Quedó en pensarlo." },
  { id: "ev-10", tipo: "prueba", cliente: "Agustina Pérez", telefono: "099 165 730", vehiculo: "Nissan Tiida Sense 2015", dias: -5, hora: 11, minuto: 30, duracion: 45, nota: "Terminó comprándolo." },
];

async function limpiar() {
  await prisma.oferta.deleteMany();
  await prisma.vehiculo.deleteMany();
  await prisma.categoria.deleteMany();
  await prisma.evento.deleteMany();
  await prisma.usuario.deleteMany();
}

async function main() {
  console.log("Limpiando tablas...");
  await limpiar();

  await prisma.categoria.createMany({
    data: CATEGORIAS.map((nombre, i) => ({
      id: `cat-${i + 1}`,
      nombre,
      fecha_creacion: diasAtras(400),
    })),
  });

  const categorias = await prisma.categoria.findMany();
  const idDeCategoria = new Map(categorias.map((c) => [c.nombre, c.id]));

  const contrasena = await bcrypt.hash(PASSWORD_DEMO, 10);
  await prisma.usuario.createMany({
    data: USUARIOS.map((u) => ({
      id: u.id,
      email: u.email,
      contrasena,
      nombre_completo: u.nombre_completo,
      rol: u.rol,
      activo: u.activo,
      historias: u.historias,
      fecha_creacion: diasAtras(u.dias),
      fecha_modificacion: diasAtras(u.dias),
    })),
  });

  await prisma.vehiculo.createMany({
    data: VEHICULOS.map(({ categoria, ...v }) => ({
      ...v,
      categoria_id: idDeCategoria.get(categoria),
    })),
  });

  await prisma.oferta.createMany({
    data: OFERTAS.map(({ dias, ...o }) => ({
      ...o,
      fecha_creacion: diasAtras(dias, 9, 30),
    })),
  });

  await prisma.evento.createMany({
    data: EVENTOS.map(({ dias, hora, minuto, duracion, ...e }) => {
      const inicio = enDias(dias, hora, minuto);
      const fin = new Date(inicio.getTime() + duracion * 60_000);
      const creado = diasAtras(Math.max(dias, 0) + 2);
      return { ...e, inicio, fin, fecha_creacion: creado, fecha_modificacion: creado };
    }),
  });

  const conteos = {
    categoria: await prisma.categoria.count(),
    usuario: await prisma.usuario.count(),
    vehiculo: await prisma.vehiculo.count(),
    oferta: await prisma.oferta.count(),
    evento: await prisma.evento.count(),
  };

  console.log("\nDatos cargados:");
  for (const [tabla, n] of Object.entries(conteos)) {
    console.log(`  ${String(n).padStart(3)}  ${tabla}`);
  }
  console.log(`\nUsuarios de prueba: contraseña "${PASSWORD_DEMO}" para todos.`);
}

main()
  .catch((e) => {
    console.error("El seed falló:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
