import { SuccessfulResponse, ErrorResponse } from "../models/response.model.js";

export function ok(res, message, data) {
    res.status(200).send(new SuccessfulResponse(true, 200, 'Ok', message, data));
}

export function created(res, message, data) {
    res.status(201).send(new SuccessfulResponse(true, 201, 'Created', message, data));
}

export function accepted(res, message) {
    res.status(202).send(new SuccessfulResponse(true, 202, 'Accepted', message));
}

export function badRequest(res, message) {
    res.status(400).send(new ErrorResponse(false, 400, 'Bad Request', message));
}

export function unauthorized(res, message) {
    res.status(401).send(new ErrorResponse(false, 401, 'Unauthorized', message));
}
export function internalServerError(res, message) {
    res.status(500).send(new ErrorResponse(false, 500, 'Internal Server Error', message));
}