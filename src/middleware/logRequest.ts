import { NextFunction, Request, Response } from "express";
import { AnySchema, ValidationError } from "yup";
import log from "../logger";

const logRequest = (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const child = log.child({
        url: request.url,
        method: request.method,
        body: request.body,
    });
    child.info("Incoming Request: ");
    return next();
};
export default logRequest;
