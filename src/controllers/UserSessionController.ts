import { Response, Request } from "express";
import { get } from "lodash";
import { validateUserPassword } from "../services/UserService";
import {
    createUserSession,
    createAccessToken,
    createRefreshToken,
    updateSession,
    findSessions,
} from "../services/UserSessionService";

export const createUserSessionHandler = async (
    request: Request,
    response: Response
) => {
    //validate that the email is registered and the password matches
    const user = await validateUserPassword(request.body);
    if (!user) return response.status(401).send("Invalid username or password");

    //create a session
    const session = await createUserSession(
        user._id,
        request.get("user-agent") || ""
    );
    //create an access token
    const accessToken = createAccessToken({ user, session });

    //create a refresh token
    const refreshToken = createRefreshToken({ session });

    //send refresh & access token back to the user
    return response.send({ accessToken, refreshToken }).status(200);
};

export const deleteUserSessionHandler = async (
    request: Request,
    response: Response
) => {
    const sessionId = get(request, "user.session");
    await updateSession({ _id: sessionId }, { valid: false });

    return response.sendStatus(200);
};

export const getUserSessionsHandler = async (
    request: Request,
    response: Response
) => {
    const userId = get(request, "user._id");
    const sessions = await findSessions({ user: userId, valid: true });
    return response.send(sessions);
};
