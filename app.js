import express from 'express';
import cors from 'cors';
import { router as crawlerRouter } from './routers/crawler.router.js';

export const app = express();
app.use(express.json());
app.use(cors());

app.route('/').get((req, res) => res.status(200).send('OK'));
app.use("/api/crawler", crawlerRouter);