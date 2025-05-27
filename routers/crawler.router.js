import { Router } from 'express';
import * as crawlerController from '../controllers/crawler.controller.js';

export const router = Router();

router.route('/oldCrawl').post(crawlerController.startCrawlingController);
router.route('/newCrawl').post(crawlerController.startCrawlingController2);
router.route('/receiveReport').post(crawlerController.receiveReportFromWorker);
