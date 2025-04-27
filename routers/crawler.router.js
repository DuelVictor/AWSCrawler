import { Router } from 'express';
import * as crawlerController from '../controllers/crawler.controller.js';

export const router = Router();

router.route('/').
    post(crawlerController.startCrawlingController);
