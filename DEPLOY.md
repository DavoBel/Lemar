# Despliegue del backend

Guía de lo que hay que configurar para poner la API en producción.

## 1. Variables de entorno

Están todas en `.env.example`, con el formato de cada una. Son once y **ninguna
es opcional salvo `UMBRAL_CONSUMO` y `PORT`**:

| Variable | Para qué |
|---|---|
| `DATABASE_URL` | Neon, conexión **pooled** (el host lleva `-pooler`). La usa la app en runtime. |
| `DIRECT_URL` | Neon, conexión **directa**. La usan las migraciones. |
| `SECRET_JWT` | Firma del token de sesión. Larga y distinta de la de desarrollo. |
| `NODE_ENV` | En producción tiene que decir exactamente `production`. |
| `PORT` | El host suele imponer el suyo; `server.js` usa 3000 si no está. |
| `URL_PANEL` | Origen del panel, para CORS. Sin barra final. |
| `URL_SITIO` | Origen del sitio, para CORS. Sin barra final. |
| `CLOUDINARY_CLOUD_NAME` | Subida de fotos. |
| `CLOUDINARY_API_KEY` | Subida de fotos. |
| `CLOUDINARY_API_SECRET` | Subida de fotos. |
| `UMBRAL_CONSUMO` | Umbral del aviso de consumo de Cloudinary. Por defecto 60. |

Al pegar los valores en el panel del host, **sin las comillas** que llevan en el
archivo `.env`. Una `DATABASE_URL` pegada con comillas se parsea con el host
literal `"base"` y falla con `getaddrinfo EAI_AGAIN base`.

Los mismos secretos de Cloudinary y `DATABASE_URL` van también en
*Settings → Secrets → Actions* del repositorio, que es de donde los toman los
dos workflows programados.

## 2. Build y arranque

```
npm install          # dispara postinstall -> prisma generate
npm run migrate:deploy
npm start
```

`postinstall` corre `prisma generate`: sin eso el cliente de Prisma no queda
generado para el entorno del host y la app arranca pero falla en la primera
consulta.

**Si el host instala con `npm ci --omit=dev`**, hay que mover `prisma` de
`devDependencies` a `dependencies`, porque el CLI se poda antes de que corra
el `postinstall`.

Las migraciones van con `prisma migrate deploy`, **nunca** con `migrate dev`,
que puede pedir confirmación y reescribir el historial. Usan `DIRECT_URL`, no
la pooled.

**El seed no va en producción**: borra y recarga datos de prueba.

## 3. Dominios y cookie de sesión

Decisión tomada: el backend va en un **subdominio propio**.

```
panel.lemarautomoviles.com  ->  api.lemarautomoviles.com
lemarautomoviles.com        ->  api.lemarautomoviles.com
```

Panel y API quedan en el mismo dominio registrable, así que son el mismo sitio
y la cookie con `sameSite: "lax"` viaja sin problemas. **No hay que tocar
código.**

Lo que sí hay que hacer: crear el registro DNS de `api` apuntando al host, y
cargar `URL_PANEL` y `URL_SITIO` con los dominios reales.

Si algún día la API pasara a un dominio del host (`algo.onrender.com`), serían
sitios distintos y habría que cambiar la cookie a `sameSite: "none"` con
`secure: true` en `v1/controllers/auth.controller.js`. Es más frágil: varios
navegadores y el modo incógnito bloquean cookies de terceros.

## 4. Proxy

`app.js` tiene `app.set("trust proxy", 1)`. Es imprescindible para el rate
limit del alta de ofertas: detrás de un proxy todas las requests llegan con la
IP del proxy y sin esta línea el contador sería uno solo para todo el mundo.

No cambiarlo a `true`: eso le cree el header `X-Forwarded-For` a cualquiera y
saltarse el límite pasa a ser cuestión de mandar una cabecera distinta. El `1`
significa "confiá en un solo proxy, el nuestro". Si el host encadena dos, hay
que subirlo a 2.

## 5. Cosas a tener presentes

- **El rate limit vive en memoria.** Se reinicia en cada deploy y no se
  comparte entre instancias. Para este volumen está bien; si algún día la API
  corre en más de una instancia, el límite real pasa a ser 5 por instancia.
- **Los workflows programados se desactivan solos** tras 60 días sin actividad
  en el repositorio. GitHub avisa por mail antes.
- **Neon duerme la base** en el plan gratuito. Con la conexión pooled el
  arranque en frío se resuelve solo; con la directa aparecen errores
  intermitentes.
