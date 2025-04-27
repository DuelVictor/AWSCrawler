import { ok } from "../utilities/response.utilities.js";

export function healthcheck(_, res) {
    return ok(res, "Ok");
}