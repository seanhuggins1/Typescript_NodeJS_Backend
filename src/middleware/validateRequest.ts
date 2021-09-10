import { NextFunction, Request, Response } from "express";
import { AnySchema, ValidationError } from "yup";
import log from "../logger";

const validateRequest =
    (schema: AnySchema) =>
    async (request: Request, response: Response, next: NextFunction) => {
        try {
            await schema.validate({
                body: request.body,
                query: request.query,
                params: request.params,
            });

            return next();
        } catch (error) {
            if (error instanceof ValidationError) {
                log.error(error as Error);
                return response.status(400).send(error.errors);
            }
        }
    };
export default validateRequest;
