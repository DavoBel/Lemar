-- CreateEnum
CREATE TYPE "Moneda" AS ENUM ('USD', 'UYU');

-- CreateEnum
CREATE TYPE "VehiculoEstado" AS ENUM ('disponible', 'reservado', 'vendido');

-- CreateEnum
CREATE TYPE "OfertaEstado" AS ENUM ('nueva', 'en_revision', 'tasada', 'rechazada', 'aceptada');

-- CreateEnum
CREATE TYPE "Choques" AS ENUM ('no', 'menores', 'importantes');

-- CreateEnum
CREATE TYPE "DeudaPrenda" AS ENUM ('no', 'deuda', 'prenda', 'ambas');

-- CreateEnum
CREATE TYPE "EventoTipo" AS ENUM ('visita', 'prueba', 'tasacion', 'entrega');

-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'empleado');

-- CreateTable
CREATE TABLE "categoria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categoria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vehiculo" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '',
    "anio" INTEGER NOT NULL,
    "km" INTEGER NOT NULL,
    "patente" TEXT NOT NULL,
    "combustible" TEXT NOT NULL,
    "caja" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "motor" TEXT NOT NULL,
    "consumo" TEXT NOT NULL,
    "potencia" TEXT NOT NULL,
    "caracteristicas" TEXT[],
    "categoria_id" TEXT NOT NULL,
    "precio" INTEGER NOT NULL,
    "precio_compra" INTEGER,
    "moneda" "Moneda" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fotos" TEXT[],
    "estado" "VehiculoEstado" NOT NULL DEFAULT 'disponible',
    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMPTZ(3) NOT NULL,
    "fecha_vendido" TIMESTAMPTZ(3),

    CONSTRAINT "vehiculo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oferta" (
    "id" TEXT NOT NULL,
    "marca" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "version" TEXT NOT NULL DEFAULT '',
    "anio" INTEGER NOT NULL,
    "km" INTEGER NOT NULL,
    "patente" TEXT NOT NULL,
    "combustible" TEXT NOT NULL,
    "caja" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "motor" TEXT NOT NULL,
    "choques" "Choques" NOT NULL,
    "desperfectos" TEXT NOT NULL,
    "accesorios" TEXT NOT NULL,
    "titularidad_propia" BOOLEAN NOT NULL,
    "vtv_al_dia" BOOLEAN NOT NULL,
    "documentacion_completa" BOOLEAN NOT NULL,
    "deuda_prenda" "DeudaPrenda" NOT NULL,
    "tiene_multas" BOOLEAN NOT NULL,
    "duenos" INTEGER NOT NULL,
    "nombre" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" "OfertaEstado" NOT NULL DEFAULT 'nueva',
    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tasacion_interna" INTEGER,
    "nota_interna" TEXT,

    CONSTRAINT "oferta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evento" (
    "id" TEXT NOT NULL,
    "tipo" "EventoTipo" NOT NULL,
    "cliente" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "vehiculo" TEXT NOT NULL,
    "inicio" TIMESTAMPTZ(3) NOT NULL,
    "fin" TIMESTAMPTZ(3) NOT NULL,
    "nota" TEXT NOT NULL DEFAULT '',
    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "evento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "contrasena" TEXT,
    "nombre_completo" TEXT NOT NULL,
    "rol" "Roles" NOT NULL DEFAULT 'empleado',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "historias" INTEGER NOT NULL DEFAULT 0,
    "fecha_creacion" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_modificacion" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "categoria_nombre_key" ON "categoria"("nombre");

-- CreateIndex
CREATE INDEX "vehiculo_estado_fecha_creacion_idx" ON "vehiculo"("estado", "fecha_creacion" DESC);

-- CreateIndex
CREATE INDEX "vehiculo_fecha_creacion_idx" ON "vehiculo"("fecha_creacion" DESC);

-- CreateIndex
CREATE INDEX "vehiculo_categoria_id_idx" ON "vehiculo"("categoria_id");

-- CreateIndex
CREATE INDEX "vehiculo_fecha_vendido_idx" ON "vehiculo"("fecha_vendido");

-- CreateIndex
CREATE INDEX "oferta_fecha_creacion_idx" ON "oferta"("fecha_creacion" DESC);

-- CreateIndex
CREATE INDEX "oferta_estado_idx" ON "oferta"("estado");

-- CreateIndex
CREATE INDEX "evento_inicio_idx" ON "evento"("inicio");

-- CreateIndex
CREATE UNIQUE INDEX "usuario_email_key" ON "usuario"("email");

-- AddForeignKey
ALTER TABLE "vehiculo" ADD CONSTRAINT "vehiculo_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "categoria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
