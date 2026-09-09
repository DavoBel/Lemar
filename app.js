import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import v1Router from "./v1/v1.routes.js";
import { notFoundMiddleware } from "./v1/middlewares/notFound.middleware.js";
import { errorMiddleware } from "./v1/middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

const ORIGENES_PERMITIDOS = [
    process.env.URL_PANEL,
    process.env.URL_SITIO,
    "http://localhost:5173",
    "http://localhost:5174",
].filter(Boolean);

app.use(cors({
    origin: ORIGENES_PERMITIDOS,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("API funcionando");
});

app.use("/v1", v1Router);

app.use(notFoundMiddleware);
app.use(errorMiddleware);


export default app;