import { get } from "lodash";
import { Request, Response, NextFunction, response } from "express";
import { decode } from "../utils/jwt.utils";
import { reissueAccessToken } from "../services/UserSessionService";

export const deserializeUser = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    //get the access token from the request header
    const accessToken = get(request, "headers.authorization", "").replace(
        /^Bearer\s/,
        ""
    );

    //get the refresh token from the request header
    const refreshToken = get(request, "headers.x-refresh");

    if (!accessToken) return next(); //no access token

    const { decoded, expired } = decode(accessToken);

    if (decoded) {
        //access token exists and is valid
        //@ts-ignore
        request.user = decoded;
        return next();
    }

    if (expired && refreshToken) {
        //access token is expired but a refresh token exists
        const newAccessToken = await reissueAccessToken({ refreshToken });
        if (newAccessToken) {
            response.setHeader("x-access-token", newAccessToken);
            const { decoded } = decode(newAccessToken);

            //@ts-ignore
            request.user = decoded;
        }
        return next();
    }

    return next();
};
