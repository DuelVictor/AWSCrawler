import express from 'express';
import cors from 'cors';
import { router as crawlerRouter } from './routers/crawler.router.js';
import { router as healthcheckRouter } from './routers/healthcheck.router.js';

export const app = express();
app.use(express.json());
app.use(cors());

app.use("").get("", (req, res) => res.status(200).send('OK'));
app.use("/api/crawler", crawlerRouter);