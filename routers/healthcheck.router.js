import { Router } from 'express';
import * as healthcheckController from '../controllers/healthcheck.controller.js';

export const router = Router();

router.route("").
    post(healthcheckController.healthcheck);
