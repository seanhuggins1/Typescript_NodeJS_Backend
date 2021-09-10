import { Response, Request } from "express";
import { createUser } from "../services/UserService";
import { omit } from "lodash";
import log from "../logger";

export const createUserHandler = async (
    request: Request,
    response: Response
) => {
    try {
        const user = await createUser(request.body);

        //if success
        return response.send(omit(user.toJSON(), "password"));
    } catch (error) {
        log.error(error as Error);
        return response.status(409).send(error as Error);
    }
};
