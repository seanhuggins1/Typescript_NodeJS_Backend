import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import log from "./logger";
import cors from "cors";
import { connect } from "./database/connect";
import MainRouter from "./routers/MainRouter";
import logRequest from "./middleware/logRequest";
import { deserializeUser } from "./middleware/deserializeUser";

// load .env
dotenv.config({
    path: path.join(__dirname, "../.env"),
});
const port = (process.env.APP_PORT || 5000) as number;
const host = (process.env.HOST || "localhost") as string;
const app = express();

connect();

app.use(cors());
app.use(express.json());
app.use(logRequest);
app.use(deserializeUser);

app.use("/api", MainRouter);
app.listen(port, () => log.info(`Listening on http://${host}:${port}`));
